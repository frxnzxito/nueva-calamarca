import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/usuarios': 'http://localhost:3000',
      '/turnos': 'http://localhost:3000',
      '/puestos': 'http://localhost:3000',
      '/asistencia': 'http://localhost:3000',
      '/produccion': 'http://localhost:3000',
      '/minas': 'http://localhost:3000',
    }
  }
});