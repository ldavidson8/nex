<script lang="ts">
	import { page } from '$app/state';

	const slug = $derived(page.params.slug);
</script>

<div class="flex h-dvh flex-col items-center justify-center">
	<h1>Current Slug: {slug}</h1>
	<p>URL Param is: {page.params.slug}</p>
</div>
