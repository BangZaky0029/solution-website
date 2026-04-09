// =========================================
// FILE: vite.config.js
// =========================================
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // esbuild is default & 10-20x faster than terser
    minify: 'esbuild',
    // Skip gzip size report to speed up build
    reportCompressedSize: false,
    // html2pdf.js is inherently large (~975KB) - suppress false warnings
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // Split large vendors into separate chunks for parallel processing
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-icons': ['lucide-react'],
          'vendor-pdf': ['html2pdf.js'],
        }
      }
    }
  }
})
