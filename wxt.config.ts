import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';
import path from 'node:path';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte', '@wxt-dev/auto-icons'],
  manifest: {
    name: 'Dal QRcode',
    permissions: ['tabs', 'clipboardWrite'],
  },
  autoIcons: {
    baseIconPath: 'assets/icon.svg',
  },
  webExt: {
    startUrls: ['https://wxt.dev'],
    openDevtools: true,
  },
  alias: {
    $lib: path.resolve('./src/lib'),
  },
  vite: () => ({
    plugins: [
      tailwindcss(),
      Icons({
        compiler: 'svelte',
        customCollections: {
          assets: FileSystemIconLoader('./src/assets', (svg) =>
            svg.replace(/fill="black"/, 'fill="currentColor"'),
          ),
        },
      }),
    ],
  }),
});
