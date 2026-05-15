import svg from "@poppanator/sveltekit-svg";
import { sveltekit } from "@sveltejs/kit/vite";
import Icons from "unplugin-icons/vite";
import devtoolsJson from "vite-plugin-devtools-json";

import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	server: {
		port: 3000,
	},
	plugins: [
		tailwindcss(),
		sveltekit(),
		devtoolsJson(),
		Icons({
			compiler: "svelte",
		}),
		svg({
			includePaths: ["./src/lib/icons/"],
			svgoOptions: {
				multipass: true,
				plugins: [
					{
						name: "preset-default",
					},
				],
			},
		}),
	],
	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"],
	},
});
