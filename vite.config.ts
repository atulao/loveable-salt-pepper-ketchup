
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { eventsMiddleware } from './src/server-middleware';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    // Configure the server to use our middleware
    middlewareMode: 'html',
    configureServer: (server) => {
      server.middlewares.use(eventsMiddleware);
    },
  },
});
