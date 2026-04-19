import { mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      include: ['src/**/*.test.{ts,tsx}'],
      clearMocks: true,
      reporters: ['default', ['json', { outputFile: '.vitest/report.json' }]],
      coverage: {
        provider: 'v8',
        reportsDirectory: 'coverage',
        reporter: ['text', 'json-summary', 'html'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/**/*.test.{ts,tsx}',
          'src/main.tsx',
          'src/vite-env.d.ts',
        ],
      },
    },
  }),
)
