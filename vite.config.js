import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api':'https://mern-estate-34xz.onrender.com',
      
    }
  },
  plugins: [react()],
})
