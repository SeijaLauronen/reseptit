module.exports = {
    testEnvironment: 'jsdom',  // Käytetään selaimen kaltaista ympäristöä
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],  // Ladataan jest.setup.js automaattisesti ennen testejä
};