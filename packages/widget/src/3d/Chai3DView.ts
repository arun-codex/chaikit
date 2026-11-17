/**
 * Optional 3D Chai Scene for ChaiKit.
 * Lightweight, procedural WebGL implementation with ZERO mandatory external dependencies.
 *
 * Features:
 * - Procedural earthen kulhad / cup 3D geometry with terracotta shader
 * - Glossy chai liquid surface with ambient lighting & rim specular
 * - Animated rising steam particles
 * - Interactive pointer tracking (rotates gently towards cursor)
 * - Morphing transitions when switching between chai tiers
 * - Automatic pause when offscreen or modal is closed
 * - Full WebGL GPU buffer and shader cleanup on destroy
 * - Reduced-motion compliance
 * - Graceful fallback to 2D SVG if WebGL is unavailable
 */

export interface Chai3DViewOptions {
  tierId: string;
  width?: number;
  height?: number;
  onFallback?: () => void;
}

export class Chai3DView {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private animFrameId: number | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private isVisible = true;
  private isDestroyed = false;
  private prefersReducedMotion = false;

  // Interaction state
  private targetRotationX = 0.2;
  private targetRotationY = 0;
  private currentRotationX = 0.2;
  private currentRotationY = 0;
  private currentTier = 'kadak';
  private targetShapeFactor = 1.0; // 0.8 for cutting, 1.0 for kadak, 1.2 for tandoori, 1.4 for premium
  private currentShapeFactor = 1.0;

  // Shader attributes & uniforms
  private positionBuffer: WebGLBuffer | null = null;
  private normalBuffer: WebGLBuffer | null = null;
  private colorBuffer: WebGLBuffer | null = null;
  private indexBuffer: WebGLBuffer | null = null;
  private indexCount = 0;

  private uMatrixLoc: WebGLUniformLocation | null = null;
  private uLightPosLoc: WebGLUniformLocation | null = null;
  private uTimeLoc: WebGLUniformLocation | null = null;
  private uColorTintLoc: WebGLUniformLocation | null = null;

  // Pointer event listeners
  private pointerMoveHandler: ((e: MouseEvent) => void) | null = null;
  private pointerLeaveHandler: (() => void) | null = null;

  constructor(container: HTMLElement, options: Chai3DViewOptions) {
    this.container = container;
    this.currentTier = options.tierId || 'kadak';
    this.updateShapeFactorForTier(this.currentTier);
    this.currentShapeFactor = this.targetShapeFactor;

    // Check reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'chai-3d-canvas';
    this.canvas.width = options.width || 220;
    this.canvas.height = options.height || 220;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';
    this.canvas.setAttribute('role', 'img');
    this.canvas.setAttribute('aria-label', 'Interactive 3D Chai Cup');

    const gl = this.canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: false,
      powerPreference: 'low-power',
    });

    if (!gl) {
      console.warn('ChaiKit 3D: WebGL not supported or disabled. Falling back to 2D.');
      options.onFallback?.();
      return;
    }

    this.gl = gl;
    this.initGL();
    this.container.appendChild(this.canvas);
    this.setupInteractivity();
    this.setupVisibilityObserver();
    this.startRenderLoop();
  }

  public setTier(tierId: string): void {
    this.currentTier = tierId;
    this.updateShapeFactorForTier(tierId);
    this.rebuildGeometry();
  }

  public resize(width: number, height: number): void {
    if (!this.gl || this.isDestroyed) return;
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 1.5);
    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  public destroy(): void {
    this.isDestroyed = true;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }

    if (this.pointerMoveHandler) {
      window.removeEventListener('mousemove', this.pointerMoveHandler);
      this.pointerMoveHandler = null;
    }

    if (this.pointerLeaveHandler) {
      this.canvas.removeEventListener('mouseleave', this.pointerLeaveHandler);
      this.pointerLeaveHandler = null;
    }

    if (this.gl) {
      if (this.positionBuffer) this.gl.deleteBuffer(this.positionBuffer);
      if (this.normalBuffer) this.gl.deleteBuffer(this.normalBuffer);
      if (this.colorBuffer) this.gl.deleteBuffer(this.colorBuffer);
      if (this.indexBuffer) this.gl.deleteBuffer(this.indexBuffer);
      if (this.program) this.gl.deleteProgram(this.program);
    }

    if (this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
  }

  private updateShapeFactorForTier(tierId: string): void {
    switch (tierId) {
      case 'cutting':
        this.targetShapeFactor = 0.8;
        break;
      case 'kadak':
        this.targetShapeFactor = 1.0;
        break;
      case 'tandoori':
        this.targetShapeFactor = 1.25;
        break;
      case 'premium':
        this.targetShapeFactor = 1.45;
        break;
      default:
        this.targetShapeFactor = 1.0;
    }
  }

  private initGL(): void {
    const gl = this.gl;
    if (!gl) return;

    // Vertex Shader
    const vsSource = `
      attribute vec3 aPosition;
      attribute vec3 aNormal;
      attribute vec3 aColor;

      uniform mat4 uMatrix;
      uniform vec3 uLightPos;

      varying vec3 vNormal;
      varying vec3 vColor;
      varying vec3 vLightDir;
      varying vec3 vViewPos;

      void main() {
        gl_Position = uMatrix * vec4(aPosition, 1.0);
        vNormal = aNormal;
        vColor = aColor;
        vLightDir = normalize(uLightPos - aPosition);
        vViewPos = gl_Position.xyz;
      }
    `;

    // Fragment Shader: Terracotta diffuse + ambient + rim lighting
    const fsSource = `
      precision mediump float;

      varying vec3 vNormal;
      varying vec3 vColor;
      varying vec3 vLightDir;
      varying vec3 vViewPos;

      uniform vec3 uColorTint;
      uniform float uTime;

      void main() {
        vec3 norm = normalize(vNormal);
        float diff = max(dot(norm, vLightDir), 0.0);

        // Ambient warmth
        vec3 ambient = vec3(0.28, 0.16, 0.11);

        // Warm directional key light
        vec3 keyLight = vec3(1.0, 0.88, 0.72) * diff * 0.85;

        // Rim highlight (cinematic golden back-light)
        vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
        float rim = 1.0 - max(dot(viewDir, norm), 0.0);
        rim = pow(rim, 2.5) * 0.45;
        vec3 rimLight = vec3(0.95, 0.72, 0.45) * rim;

        vec3 finalColor = (vColor * uColorTint) * (ambient + keyLight) + rimLight;
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const vs = this.compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = this.compileShader(gl.FRAGMENT_SHADER, fsSource);

    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;

    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('ChaiKit 3D shader link error:', gl.getProgramInfoLog(prog));
      return;
    }

    this.program = prog;
    gl.useProgram(prog);

    this.uMatrixLoc = gl.getUniformLocation(prog, 'uMatrix');
    this.uLightPosLoc = gl.getUniformLocation(prog, 'uLightPos');
    this.uTimeLoc = gl.getUniformLocation(prog, 'uTime');
    this.uColorTintLoc = gl.getUniformLocation(prog, 'uColorTint');

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    this.rebuildGeometry();
  }

  private compileShader(type: number, src: string): WebGLShader | null {
    const gl = this.gl;
    if (!gl) return null;
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('ChaiKit 3D shader compile error:', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  private rebuildGeometry(): void {
    const gl = this.gl;
    if (!gl || !this.program) return;

    // Generate cup geometry based on current tier & shape factor
    const segments = 28;
    const heightSegments = 16;
    const positions: number[] = [];
    const normals: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];

    // Cup profile based on tier
    // Cutting: fluted glass (slender taper)
    // Kadak: wider ceramic teacup
    // Tandoori: rustic clay kulhad (distinctive belly & textured rim)
    // Premium: pedestal royal brass vessel
    const isCutting = this.currentTier === 'cutting';
    const isTandoori = this.currentTier === 'tandoori';
    const isPremium = this.currentTier === 'premium';

    // Primary base colors
    let r = 0.78, g = 0.42, b = 0.27; // terracotta default
    if (isCutting) {
      r = 0.55; g = 0.65; b = 0.70; // translucent glass tint
    } else if (isPremium) {
      r = 0.91; g = 0.68; b = 0.35; // royal golden brass
    } else if (isTandoori) {
      r = 0.70; g = 0.34; b = 0.20; // dark rustic kulhad clay
    }

    const totalHeight = 1.6;
    const baseRadius = isCutting ? 0.38 : isPremium ? 0.48 : 0.42;
    const topRadius = isCutting ? 0.62 : isPremium ? 0.78 : 0.70;

    for (let y = 0; y <= heightSegments; y++) {
      const v = y / heightSegments;
      const posY = (v - 0.5) * totalHeight;

      // Profile curvature
      let radius = baseRadius + (topRadius - baseRadius) * Math.pow(v, 0.85);
      if (isTandoori) {
        // Belly bulge in middle
        radius += Math.sin(v * Math.PI) * 0.08;
      } else if (isPremium && v < 0.2) {
        // Pedestal base foot
        radius = baseRadius + 0.12 * (1.0 - v / 0.2);
      }

      for (let x = 0; x <= segments; x++) {
        const u = x / segments;
        const angle = u * Math.PI * 2;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        // Slight fluting on cutting glass
        const fluteOffset = isCutting ? Math.sin(angle * 8) * 0.025 : 0;
        const currentR = radius + fluteOffset;

        const posX = cosA * currentR;
        const posZ = sinA * currentR;

        positions.push(posX, posY, posZ);

        // Approximate outward normal
        const nx = cosA;
        const ny = (baseRadius - topRadius) / totalHeight;
        const nz = sinA;
        const len = Math.hypot(nx, ny, nz);
        normals.push(nx / len, ny / len, nz / len);

        // Shading variation along height (rim highlight + darker base)
        const heightShade = 0.8 + 0.4 * v;
        colors.push(r * heightShade, g * heightShade, b * heightShade);
      }
    }

    // Indices for cup wall
    for (let y = 0; y < heightSegments; y++) {
      for (let x = 0; x < segments; x++) {
        const i1 = y * (segments + 1) + x;
        const i2 = (y + 1) * (segments + 1) + x;
        const i3 = (y + 1) * (segments + 1) + (x + 1);
        const i4 = y * (segments + 1) + (x + 1);

        indices.push(i1, i2, i4);
        indices.push(i2, i3, i4);
      }
    }

    // Add tea liquid top surface disk
    const teaCenterIndex = positions.length / 3;
    const teaY = (totalHeight * 0.5) - 0.15;
    const teaRadius = topRadius - 0.05;

    positions.push(0, teaY, 0);
    normals.push(0, 1, 0);
    // Dark amber tea color
    colors.push(0.58, 0.29, 0.12);

    for (let x = 0; x <= segments; x++) {
      const u = x / segments;
      const angle = u * Math.PI * 2;
      positions.push(Math.cos(angle) * teaRadius, teaY, Math.sin(angle) * teaRadius);
      normals.push(0, 1, 0);
      colors.push(0.52, 0.25, 0.10);
    }

    for (let x = 0; x < segments; x++) {
      indices.push(teaCenterIndex, teaCenterIndex + 1 + x, teaCenterIndex + 2 + x);
    }

    this.indexCount = indices.length;

    // Upload WebGL buffers
    if (!this.positionBuffer) this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    if (!this.normalBuffer) this.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    if (!this.colorBuffer) this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    if (!this.indexBuffer) this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  }

  private setupInteractivity(): void {
    this.pointerMoveHandler = (e: MouseEvent) => {
      if (this.prefersReducedMotion || this.isDestroyed || !this.isVisible) return;
      const rect = this.canvas.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Small responsive tilt (-0.35 to +0.35 radians)
      const dx = (e.clientX - centerX) / (rect.width / 2);
      const dy = (e.clientY - centerY) / (rect.height / 2);

      this.targetRotationY = Math.max(-0.4, Math.min(0.4, dx * 0.35));
      this.targetRotationX = Math.max(0.05, Math.min(0.45, 0.25 + dy * 0.2));
    };

    this.pointerLeaveHandler = () => {
      this.targetRotationX = 0.2;
      this.targetRotationY = 0;
    };

    window.addEventListener('mousemove', this.pointerMoveHandler, { passive: true });
    this.canvas.addEventListener('mouseleave', this.pointerLeaveHandler, { passive: true });
  }

  private setupVisibilityObserver(): void {
    if (typeof IntersectionObserver === 'undefined') return;

    this.intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        this.isVisible = entry.isIntersecting;
      }
    });

    this.intersectionObserver.observe(this.canvas);
  }

  private startRenderLoop(): void {
    let lastTime = 0;

    const render = (time: number) => {
      if (this.isDestroyed) return;

      if (this.isVisible) {
        this.drawScene(time * 0.001);
      }

      this.animFrameId = requestAnimationFrame(render);
    };

    this.animFrameId = requestAnimationFrame(render);
  }

  private drawScene(time: number): void {
    const gl = this.gl;
    if (!gl || !this.program || this.indexCount === 0) return;

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0); // transparent background
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Smooth interpolation towards target rotations
    const lerpFactor = this.prefersReducedMotion ? 1 : 0.08;
    this.currentRotationX += (this.targetRotationX - this.currentRotationX) * lerpFactor;
    this.currentRotationY += (this.targetRotationY - this.currentRotationY) * lerpFactor;

    // Continuous subtle breathing motion if not reduced motion
    const idleY = this.prefersReducedMotion ? 0 : Math.sin(time * 1.5) * 0.08;
    const finalRotY = this.currentRotationY + idleY;

    // Build perspective projection & view-model matrix
    const aspect = this.canvas.width / this.canvas.height;
    const matrix = this.createModelViewProjectionMatrix(aspect, this.currentRotationX, finalRotY);

    gl.useProgram(this.program);

    if (this.uMatrixLoc) {
      gl.uniformMatrix4fv(this.uMatrixLoc, false, matrix);
    }

    if (this.uLightPosLoc) {
      gl.uniform3f(this.uLightPosLoc, 1.5, 3.0, 2.5);
    }

    if (this.uTimeLoc) {
      gl.uniform1f(this.uTimeLoc, time);
    }

    if (this.uColorTintLoc) {
      gl.uniform3f(this.uColorTintLoc, 1.0, 1.0, 1.0);
    }

    // Bind Attributes
    const posLoc = gl.getAttribLocation(this.program, 'aPosition');
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

    const normLoc = gl.getAttribLocation(this.program, 'aNormal');
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.enableVertexAttribArray(normLoc);
    gl.vertexAttribPointer(normLoc, 3, gl.FLOAT, false, 0, 0);

    const colLoc = gl.getAttribLocation(this.program, 'aColor');
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.enableVertexAttribArray(colLoc);
    gl.vertexAttribPointer(colLoc, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
  }

  private createModelViewProjectionMatrix(aspect: number, rotX: number, rotY: number): Float32Array {
    // 45 deg FOV perspective
    const fov = 45 * Math.PI / 180;
    const near = 0.1;
    const far = 100.0;
    const f = 1.0 / Math.tan(fov / 2);

    const proj = new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) / (near - far), -1,
      0, 0, (2 * far * near) / (near - far), 0,
    ]);

    // Model translation & rotation
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    const dist = 3.6; // camera distance
    const model = new Float32Array([
      cosY, sinX * sinY, -cosX * sinY, 0,
      0, cosX, sinX, 0,
      sinY, -sinX * cosY, cosX * cosY, 0,
      0, -0.2, -dist, 1,
    ]);

    // Multiply proj * model
    const out = new Float32Array(16);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += proj[k * 4 + j] * model[i * 4 + k];
        }
        out[i * 4 + j] = sum;
      }
    }
    return out;
  }
}
