module.exports = {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/config/',
        '/migrations/',
        '/seeders/'
    ],
    setupFilesAfterEnv: ['./tests/setup.js'],
    collectCoverage: true,
    coverageReporters: ['text', 'html'],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        }
    }
};