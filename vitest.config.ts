import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['engine/**/*.ts'],
            exclude: ['engine/**/*.test.ts', 'engine/types.ts'],
            all: true,
            lines: 100,
            functions: 100,
            branches: 100,
            statements: 100,
        },
    },
});
