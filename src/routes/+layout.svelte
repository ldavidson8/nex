<script lang="ts">
	import { dev } from "$app/environment";
	import { onNavigate } from "$app/navigation";
	import "../app.css";

	import { ModeWatcher } from "mode-watcher";
	import ScreenSize from "$lib/components/ScreenSize.svelte";
	import Seo from "$lib/components/Seo.svelte";

	let { children } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<Seo />

<ModeWatcher />
<svelte:boundary>
	<main>
		{@render children()}
	</main>
	{#if dev}
		<ScreenSize />
	{/if}
</svelte:boundary>
