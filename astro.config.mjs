// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.alphinistlab.com',
  devToolbar: {
    enabled: false
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Keep page scripts as external files so the server's CSP (script-src 'self') allows them.
      assetsInlineLimit: 0
    }
  }
});
