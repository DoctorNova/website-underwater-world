

import { defineConfig } from 'vite';
import { getConfig, getRepositoryName } from '../../vite.shared';

export default defineConfig(getConfig({
  root: __dirname,
  base: getRepositoryName(),
  port: 5173
}));