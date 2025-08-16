import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';
import path from 'node:path';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte', '@wxt-dev/auto-icons'],
  manifest: {
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    default_locale: 'en',
    permissions: ['tabs', 'clipboardWrite'],
    content_security_policy: {
      extension_pages: "script-src 'self'; child-src 'self' blob:;",
    },
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
