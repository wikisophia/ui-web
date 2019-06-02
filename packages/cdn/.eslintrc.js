module.exports = {
    extends: 'airbnb-base',
    plugins: [
        'react-hooks'
    ],
    rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'error',
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