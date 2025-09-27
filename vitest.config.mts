import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Reduce parallel workers if system is under load
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 4,
        minThreads: 1,
      },
    },
    // Exclude files from test discovery
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
    ],
    // Reporter configuration
    reporters: ['default'],
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: [
        'coverage/**',
        'dist/**',
        'tests/**',
        '*.config.*',
      ],
    },
  },
})
