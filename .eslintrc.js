module.exports = {
    'env': {
        'browser': true,
        'es6': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript'
    ],
    'settings': {
        'react': {
            'pragma': 'React',
            'version': 'detect'
        },
    },
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 2018,
        'sourceType': 'module',
        'project': './tsconfig.json',
    },
    'plugins': [
        'react',
        '@typescript-eslint',
        'sort-imports-es6-autofix',
        'import',
        'modules-newline',
    ],
    'rules': {
        'indent': [
            'error',
            4,
        ],
        'comma-dangle': [
            'error',
            'always-multiline',
        ],
        'comma-spacing': ['error', {
            'before': false,
            'after': true
        }],
        'quotes': [
            'error',
            'single',
        ],
        'semi': [
            'error',
            'always',
        ],
        'no-var': 2,
        'no-multi-spaces': 2,
        'no-irregular-whitespace': 2,
        'no-trailing-spaces': 2,
        'sort-imports-es6-autofix/sort-imports-es6': [2, {
            'ignoreCase': false,
            'ignoreMemberSort': false,
            'memberSyntaxSortOrder': ['none', 'all', 'multiple', 'single'],
        }],
        'space-in-parens': [
            'error',
            'never',
        ],
        'array-bracket-spacing': [
            'error',
            'always',
        ],
        'object-curly-spacing': [
            'error',
            'always',
        ],
        'object-curly-newline': ['error', {
            'ObjectExpression': {
                'multiline': true,
                'minProperties': 2,
            },
            'ObjectPattern': {
                'multiline': true,
                'minProperties': 2,
            },
            'ImportDeclaration': {
                'multiline': true,
                'minProperties': 2,
            },
            'ExportDeclaration': {
                'multiline': true,
                'minProperties': 2,
            },
        }],
        'modules-newline/import-declaration-newline': 'error',
        'modules-newline/export-declaration-newline': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/prefer-string-starts-ends-with': 'error',
        'react/jsx-first-prop-new-line': [
            1,
            'multiline',
        ],
        'react/jsx-max-props-per-line': [1,
            {
                'maximum': 1,
            }
        ],
        'import/no-unresolved': [2, {
            'commonjs': true,
            'amd': true,
        }]
    }
};