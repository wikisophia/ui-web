module.exports = {
    extends: 'airbnb',
    plugins: [
        'react-hooks'
    ],
    rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'error',
        "import/prefer-default-export": 'off',
        "no-console": ['error', {'allow': ['warn', 'error']}],
        "no-param-reassign": 'off',
        "no-use-before-define": 'off',
        "space-before-function-paren": 'off',

        // TODO: Fix these
        "react/no-array-index-key": 'off',
        "jsx-a11y/no-noninteractive-tabindex": 'off',
        "jsx-a11y/no-noninteractive-element-interactions": 'off',
        "jsx-a11y/alt-text": 'off',
        "jsx-a11y/click-events-have-key-events": 'off',
        "jsx-a11y/no-static-element-interactions": 'off',
    },
    "parser": "babel-eslint",
    env: {
        browser: true
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