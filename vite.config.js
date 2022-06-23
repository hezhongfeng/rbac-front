import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      components: path.resolve(__dirname, 'src/components'),
      views: path.resolve(__dirname, 'src/views'),
      assets: path.resolve(__dirname, 'src/assets'),
      utils: path.resolve(__dirname, 'src/utils')
    }
  },
  build: {
    chunkSizeWarningLimit: 800
  },
  server: {
    port: 3336,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  plugins: [vue()]
});
