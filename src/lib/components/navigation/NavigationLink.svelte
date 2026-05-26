<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils/cn";

	let {
		href,
		children,
		class: className,
	}: {
		href: string;
		children: Snippet;
		class?: string;
	} = $props();
</script>

<li>
	<a
		{href}
		class={cn(
			"flex items-center rounded-full px-3 py-1.5 text-sm font-semibold text-primary/55 transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
			className,
		)}
	>
		{@render children()}
	</a>
</li>
