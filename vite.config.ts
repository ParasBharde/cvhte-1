import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    // Target modern browsers — smaller, faster output
    target: 'es2020',

    // Drop console/debugger statements in production
    minify: 'esbuild',

    rollupOptions: {
      output: {
        manualChunks(id) {
          // Three.js is ~600KB — give it its own chunk so it can be cached separately
          if (id.includes('node_modules/three')) return 'vendor-three';
          // Recharts + D3 deps
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3') || id.includes('node_modules/victory')) return 'vendor-charts';
          // GSAP animation library
          if (id.includes('node_modules/gsap')) return 'vendor-gsap';
          // Lucide icons
          if (id.includes('node_modules/lucide')) return 'vendor-lucide';
          // All other node_modules go into a shared vendor chunk
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
})

