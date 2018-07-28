var baseConfig = require('./jest.config');
var clone = Object.assign({}, baseConfig);

clone.collectCoverage = true;
clone.coverageThreshold = {
    global: {
        branches: 60,
        functions: 60,
        lines: 60,
        statements: 60
    }
};


module.exports = clone;
