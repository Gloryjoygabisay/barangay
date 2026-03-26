import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    // Expose on all network interfaces so the dev server is reachable
    // from other devices on the same network (e.g. mobile, containers).
    // Use only on trusted networks.
    host: true,
    port: 5173,
  },
  build: {
    chunkSizeWarningLimit: 1300,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/phaser/')) {
            return 'phaser';
          }
        }
      }
    }
  }
});
