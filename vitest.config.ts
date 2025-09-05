import { configDefaults, defineConfig } from 'vitest/config';
import { WxtVitest } from 'wxt/testing';

export default defineConfig({
  test: {
    mockReset: true,
    restoreMocks: true,
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
  plugins: [WxtVitest()],
});
