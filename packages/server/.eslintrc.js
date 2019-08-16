module.exports = {
    extends: "airbnb-base",
    rules: {
        "import/prefer-default-export": 'off',
        "no-console": ['error', {'allow': ['warn', 'error']}],
        "no-param-reassign": 'off',
        "no-use-before-define": 'off',
        "space-before-function-paren": 'off'
    },
    env: {
        node: true
    },
    overrides: [
        {
            files: [
                '**/*.test.js'
            ],
            env: {
                jest: true
            }
        }
    ]
}