import svg from '@poppanator/sveltekit-svg';
import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';
import devtoolsJson from 'vite-plugin-devtools-json';

import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	server: {
		port: 3000
	},
	plugins: [
		tailwindcss(),
		sveltekit(),
		devtoolsJson(),
		Icons({
			compiler: 'svelte'
		}),
		svg({
			includePaths: ['./src/lib/icons/'],
			svgoOptions: {
				multipass: true,
				plugins: [
					{
						name: 'preset-default'
					}
				]
			}
		}),
		SvelteKitPWA({
			strategies: 'generateSW',
			registerType: 'autoUpdate',
			manifest: {
				name: 'Nex',
				short_name: 'Nex',
				start_url: '/',
				display: 'standalone',
				background_color: '#ffffff',
				theme_color: '#ff3e00',
				icons: [
					{
						src: '/icons/android-chrome-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/icons/android-chrome-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/pokeapi\.co\/api\/v2\/.*/i,
						handler: 'StaleWhileRevalidate',
						options: {
							cacheName: 'poke-api-data',
							expiration: {
								maxEntries: 500,
								maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					},
					{
						urlPattern: /^https:\/\/raw\.githubusercontent\.com\/PokeAPI\/sprites\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'pokemon-sprites',
							expiration: {
								maxEntries: 1000,
								maxAgeSeconds: 60 * 60 * 24 * 365 // 1 Year
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					}
				]
			},
			devOptions: {
				enabled: true,
				type: 'module',
				suppressWarnings: true
			}
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
