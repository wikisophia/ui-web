module.exports = {
    "testMatch": ["<rootDir>/src/**/?(*.)+(spec|test).js?(x)"],
    "collectCoverage": true,
    "coverageThreshold": {
        "global": {
            "branches": 60,
            "functions": 60,
            "lines": 60,
            "statements": 60
        }
    }
}