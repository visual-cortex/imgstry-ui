module.exports = {
	env: {
		browser: true,
		es6: true
	},
	extends: 'eslint:recommended',
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	plugins: [
		'svelte3'
	],
	overrides: [
		{
			files: ['**/*.svelte'],
			processor: 'svelte3/svelte3'
		}
	],
	parserOptions: {
		ecmaVersion: 2019,
		sourceType: 'module'
	},
	rules: {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'windows'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		]
	}
};