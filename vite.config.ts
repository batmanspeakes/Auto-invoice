import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";

const conditionalPlugins: [string, Record<string, any>][] = [];

// @ts-ignore
if (process.env.TEMPO === "true") {
  conditionalPlugins.push(["tempo-devtools/swc", {}]);
}

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === "development" ? "/" : process.env.VITE_BASE_PATH || "/",
  optimizeDeps: {
    entries: ["src/main.tsx", "src/tempobook/**/*"],
  },
  plugins: [
    react({
      plugins: conditionalPlugins,
    }),
    tempo(),
  ],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // Listen on all local IPs
    port: 3000, // Specify a port
    open: true, // Open browser automatically
    cors: true, // Enable CORS
    hmr: {
      overlay: true // Enable HMR error overlay
    },
    // Timeout for server startup
    watch: {
      usePolling: true, // Use polling for file changes (helps in some environments)
    }
  },
  build: {
    sourcemap: true, // Generate sourcemaps for better debugging
  },
  // Add clearScreen: false to prevent Vite from clearing the terminal
  clearScreen: false
});
