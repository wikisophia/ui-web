module.exports = {
    extends: "airbnb-base",
    rules: {
        "import/prefer-default-export": 'off',
        "no-console": ['error', {'allow': ['warn', 'error']}],
        "no-param-reassign": 'off',
        "space-before-function-paren": 'off'
    },
    env: {
        browser: true
    },
    overrides: {
        files: [
            '**/*.test.js'
        ],
        env: {
            jest: true
        }
    }
}