// @ts-check
import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import oxlint from 'eslint-plugin-oxlint';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				extraFileExtensions: ['.svelte'],
				parser: tseslint.parser
			}
		},
		rules: {
			'svelte/no-navigation-without-resolve': 'off'
		}
	},
	{
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_'
				}
			],
			'@typescript-eslint/no-unused-expressions': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'prefer-const': 'off',
			'svelte/no-at-html-tags': 'off',
			'svelte/prefer-svelte-reactivity': 'off'
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/', '.svelte-kit/**/*']
	},
	...oxlint.configs['flat/recommended'],
	...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json')
);
