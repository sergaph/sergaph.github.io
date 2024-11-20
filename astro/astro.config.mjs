// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://masle.net',
  base: 'astro',
  integrations: [tailwind()],
  build: {
    assets: 'assets'
  }
});