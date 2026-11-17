import { describe, expect, it } from 'vitest';
import { generateQrSvg, svgToDataUrl } from '../src/qr/index.js';

describe('QR Utilities', () => {
  it('generates high contrast SVG with correct attributes', () => {
    const data = 'upi://pay?pa=test@upi&pn=Test&am=25.00&cu=INR';
    const svg = generateQrSvg(data, {
      size: 200,
      margin: 2,
      foreground: '#1B1410',
      background: '#FFFFFF',
    });

    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('width="200"');
    expect(svg).toContain('height="200"');
    expect(svg).toContain('viewBox="0 0 200 200"');
    expect(svg).toContain('shape-rendering="crispEdges"');
    expect(svg).toContain('role="img"');
    expect(svg).toContain('aria-label="UPI Payment QR Code"');
  });

  it('converts SVG string to browser-safe data URL', () => {
    const sampleSvg = '<svg width="10" height="10"></svg>';
    const dataUrl = svgToDataUrl(sampleSvg);

    expect(dataUrl.startsWith('data:image/svg+xml;charset=utf-8,')).toBe(true);
    expect(dataUrl).toContain('%3Csvg');
  });

  it('throws error for empty data', () => {
    expect(() => generateQrSvg('')).toThrowError(/QR data must be a non-empty string/);
  });
});
