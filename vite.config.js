import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base './' hace que las rutas de los archivos (imágenes, js, css) sean relativas:
  // el sitio funciona igual en localhost, en GitHub Pages o dentro de cualquier carpeta.
  base: './',
})