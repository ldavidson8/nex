<script lang="ts">
	import { setContext, type Snippet } from "svelte";
	import { cn } from "$lib/utils/cn";
	import { NAVIGATION_CONTEXT_KEY, NavigationState } from "./navigation-state.svelte";

	let {
		children,
		class: className,
	}: {
		children: Snippet;
		class?: string;
	} = $props();

	const state = new NavigationState();
	setContext(NAVIGATION_CONTEXT_KEY, state);
</script>

<nav class={cn("relative", className)} aria-label="Primary navigation">
	<ul class="flex items-center gap-1">
		{@render children()}
	</ul>
</nav>
