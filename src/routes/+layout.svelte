<script lang="ts">
	import { dev } from '$app/environment';
	import { onNavigate } from '$app/navigation';
	import '../app.css';
	import { pwaInfo } from 'virtual:pwa-info';

	import { ModeWatcher } from 'mode-watcher';
	import ScreenSize from '$lib/components/ScreenSize.svelte';
	import Header from '$lib/components/Header.svelte';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import Seo from '$lib/components/Seo.svelte';
	import { AppState } from '$lib/stores/app-state.svelte';

	new AppState();

	let { children, data } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');
</script>

<Seo />
<svelte:head>
	{@html webManifestLink}
</svelte:head>

<ModeWatcher />
<QueryClientProvider client={data.queryClient}>
	<svelte:boundary>
		<Header />
		<main>
			{@render children()}
		</main>
		{#if dev}
			<ScreenSize />
		{/if}
		<SvelteQueryDevtools />
	</svelte:boundary>
</QueryClientProvider>
