import { readFileSync } from 'fs';
import { defineConfig } from 'vite';
import tsconfigPaths from "vite-tsconfig-paths";

const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)));
let repoName = '';

if (packageJson.repository && packageJson.repository.url) {
  // Extract repo name from URL like "https://github.com/user/repo.git"
  const match = packageJson.repository.url.match(/\/([^\/]+?)(?:\.git)?$/);
  if (match) repoName = match[1];
}

export default defineConfig({
  // Include shader files as assets that are used directly in the code as strings
  assetsInclude: ["./src/**/*.vert", "./src/**/*.frag"],
  base: repoName ? `/${repoName}/` : '/',
  plugins: [tsconfigPaths()],
  server: {
    watch: {
      usePolling: true,
    },
  },
  test: {
    globals: true,        // Jest-like global functions
    environment: 'jsdom', // browser environment for testing functions
    coverage: {
      reporter: ['text', 'lcov'],
    },

    // Single fork to allow debugging with breakpoints
    pool: "forks",
    forks: { 
      singleFork: true 
    }
  },
});