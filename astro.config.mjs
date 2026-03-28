import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
export default defineConfig({
  site: 'https://atlasproontv.fr',
  integrations: [
    tailwind(),
  ],
  output: 'static',
});
