/** @type {import('prettier').Config} */
const config = {
    semi: false,
    singleQuote: true,
    trailingComma: 'all',
    useTabs: false,

    overrides: [
        {
            files: ['*.html', '*.css'],
            options: {
                tabWidth: 2,
            },
        },
        {
            files: ['*.js', '*.json'],
            options: {
                tabWidth: 4,
            },
        },
    ],
}

export default config

// NOTE:(peter) My prettier defaults.
