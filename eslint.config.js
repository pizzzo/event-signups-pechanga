import js from '@eslint/js'
import globals from 'globals'
import prettier from 'eslint-config-prettier'

export default [
    {
        ignores: ['dist/**', 'node_modules/**'],
    },
    {
        files: ['**/*.{js,mjs,cjs}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
        },
        rules: {
            ...js.configs.recommended.rules,

            'no-console': 'off',
            'no-unused-vars': 'off',
        },
    },

    prettier,
]
