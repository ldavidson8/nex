import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: "build",
			assets: "build",
			fallback: "index.html",
			precompress: false,
			strict: true,
		}),
		prerender: { handleUnseenRoutes: "ignore" },
	},
	compilerOptions: {
		runes: true,
		experimental: {
			async: true,
		},
	},
};

export default config;
