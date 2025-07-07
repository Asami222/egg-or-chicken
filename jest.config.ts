// jest.config.ts
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  moduleNameMapper: {
    '^isows$': '<rootDir>/tests/__mocks__/isows.ts',
    '^@/libs/supabase/client$': '<rootDir>/tests/__mocks__/supabase-client.ts',
    '\\.(css|scss|png|jpg|svg)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!isows|@supabase)',
  ],
}

export default createJestConfig(customJestConfig)