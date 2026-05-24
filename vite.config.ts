import { defineConfig } from 'vite';

// GitHub Pages: user site (owner.github.io) → / ; project site → /repo-name/
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isUserPages = repoName?.endsWith('.github.io');
const base =
	process.env.GITHUB_ACTIONS && repoName
		? isUserPages
			? '/'
			: `/${repoName}/`
		: './';

export default defineConfig({
	base,
});
