module.exports = {
    // O caminho para os arquivos de teste
    testPathIgnorePatterns: ['/node_modules/'],
    // O tipo de arquivo de teste que você está usando (neste caso, .js)
    testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
    // O ambiente de teste (neste caso, Node.js)
    testEnvironment: 'node',
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
  };