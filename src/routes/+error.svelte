<script lang="ts">
	import { page } from '$app/state';
</script>

<main class="flex min-h-svh flex-col items-center justify-center p-6 font-mono">
	<h1>{page.status} {page.error?.message}</h1>
</main>
