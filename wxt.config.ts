import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte', '@wxt-dev/auto-icons'],
  manifest: {
    name: 'Dal QRcode',
    permissions: ['tabs'],
  },
  autoIcons: {
    baseIconPath: 'assets/icon.svg',
  },
  webExt: {
    startUrls: ['https://wxt.dev'],
    openDevtools: true,
  },
});
