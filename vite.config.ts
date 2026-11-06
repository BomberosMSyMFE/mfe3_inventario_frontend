import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'mfe3_inventario',
      filename: 'remoteEntry.js',
      exposes: {
        './InventarioApp': './src/views/InventarioDashboardView.vue',
      },
      shared: ['vue', 'vue-router', '@apollo/client', '@vue/apollo-composable'],
    }),
  ],
  server: {
    port: 3003,
    host: '0.0.0.0',
    cors: true,
  },
  preview: {
    port: 3003,
    host: '0.0.0.0',
    cors: true,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});
