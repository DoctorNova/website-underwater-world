/// <reference types="vitest/config" />

import preact from "@preact/preset-vite";
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { UserConfig } from 'vite';
import tsconfigPaths from "vite-tsconfig-paths";

export function getRepositoryName(): string | undefined {
  const rootPackageJsonPath = resolve(__dirname, 'package.json');
  const packageJson = JSON.parse(
    readFileSync(new URL(rootPackageJsonPath, import.meta.url).pathname, 'utf-8')
  );
  let repoName = undefined;

  if (packageJson.repository && packageJson.repository.url) {
    // Extract repo name from URL like "https://github.com/user/repo.git"
    const match = packageJson.repository.url.match(/\/([^\/]+?)(?:\.git)?$/);
    if (match) {
      repoName = match[1];
    }
  }

  return repoName;
}

export function getConfig(projectConfig: {root: string, base: string | undefined, port: number}): UserConfig {
  return {
    root: projectConfig.root,
    resolve: {
      alias: {
        '@engine': resolve(__dirname, 'packages/engine/src'),
        '@game': resolve(__dirname, 'packages/game/src'),
        '@assets': resolve(__dirname, 'packages/assets'),
      },
    },
    // Include shader files as assets that are used directly in the code as strings
    assetsInclude: [resolve(projectConfig.root, "src/**/*.vert"), resolve(projectConfig.root, "src/**/*.frag")],
    base: projectConfig.base ? `/${projectConfig.base}/` : '/',
    plugins: [tsconfigPaths(), tailwindcss(), preact()],
    optimizeDeps: {
      include: ["preact", "preact/hooks", "preact/compat"]
    },
    server: {
      port: projectConfig.port,
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
    }
  }
}
