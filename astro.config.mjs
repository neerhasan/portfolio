// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://neerhasan.github.io',
  base: '/portfolio',
  trailingSlash: 'always',
  build: {
    assets: 'assets',
  },
  integrations: [sitemap()],
});