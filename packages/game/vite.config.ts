

import { defineConfig } from 'vite';
import { getConfig, getRepositoryName } from '../../vite.shared';

export default defineConfig(({command}) => {
  const isBuild = command === 'build';
  
  const defaultConfig = getConfig({
    root: __dirname,
    base: getRepositoryName(),
    port: 5173
  });

  return {
    ...defaultConfig,
    build: {
      sourcemap: !isBuild
    }
  }
});