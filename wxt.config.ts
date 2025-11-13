import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';
import path from 'node:path';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import Icons from 'unplugin-icons/vite';
import license from 'rollup-plugin-license';

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
    browser_specific_settings: {
      gecko: {
        data_collection_permissions: {
          required: ['none'],
        },
      },
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
      license({
        thirdParty: {
          multipleVersions: true,
          output: {
            file: path.join(__dirname, '.output', 'ThirdPartyNotices.txt'),
            encoding: 'utf-8',
          },
        },
      }),
    ],
  }),
});
