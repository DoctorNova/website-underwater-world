import { resolve } from 'path';
import { defineConfig } from 'vite';
import { getConfig, getRepositoryName } from '../../vite.shared';

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  const defaultConfig = getConfig({
    root: __dirname,
    base: getRepositoryName(),
    port: 5174
  });

  defaultConfig.plugins

  return {
    ...defaultConfig,
    // Redirect request to public folder to the game projects public folder
    publicDir: resolve(__dirname, '../game/public'),
    build: {
      sourcemap: !isBuild
    }
  }
});