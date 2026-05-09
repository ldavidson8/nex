<script lang="ts">
	import { page } from '$app/state';

	const currentUrl = page.url.origin + page.url.pathname;

	type Props = {
		title?: string;
		description?: string;
		image?: string;
		type?: string;
		date?: string | undefined;
	};

	let {
		title = 'Pokédex',
		description = 'Offline-first Pokémon database for everything about the Pokémon games',
		image = '',
		type = 'website',
		date = undefined
	}: Props = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="robots" content="follow, index" />
	<meta content={description} name="description" />
	<meta property="og:url" content={currentUrl} />
	<link rel="canonical" href={currentUrl} />
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content="Pokemon Battles" />
	<meta property="og:description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:image" content={image} />
	<meta property="og:image:alt" content="Pokemon Battles Banner" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@pokemonbattles" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
	{#if date}
		<meta property="article:published_time" content={date} />
	{/if}

	<link rel="icon" href="/icons/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
</svelte:head>
