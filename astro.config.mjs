import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://correodos.github.io/mia-proyecto/',
  base: '/mia-proyecto/',
  integrations: [sitemap()],
});
