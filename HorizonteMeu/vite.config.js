import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCommonjs() // Ativa a compatibilidade para pacotes mais antigos/híbridos
  ],
  define: {
    // Cria um objeto fake do 'process.env' exigido por algumas dependências do Globo 3D
    'process.env': {},
    global: 'window',
  },
  resolve: {
    alias: {
      // Garante que se o pacote procurar por caminhos internos do Node, ele não quebre o Vite
      path: 'path-browserify',
    },
  },
});