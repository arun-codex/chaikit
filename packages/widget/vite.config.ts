import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      include: ['src'],
      outDir: 'dist',
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ChaiKit',
      formats: ['es', 'cjs', 'iife'],
      fileName: (format) => {
        if (format === 'es') return 'chaikit.esm.js';
        if (format === 'cjs') return 'chaikit.cjs';
        return 'chaikit.iife.js';
      },
    },
    rollupOptions: {
      external: [],
    },
    sourcemap: true,
    emptyOutDir: false,
  },
});
