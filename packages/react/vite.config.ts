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
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'ChaiKitReact',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'chaikit', '@chaikit/core'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          chaikit: 'ChaiKit',
          '@chaikit/core': 'ChaiKitCore',
        },
      },
    },
    sourcemap: true,
  },
});
