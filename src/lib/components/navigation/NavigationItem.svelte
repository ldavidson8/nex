<script lang="ts">
	import { getContext, type Snippet } from "svelte";
	import ArrowUpRightIcon from "@lucide/svelte/icons/arrow-up-right";
	import { cn } from "$lib/utils/cn";
	import { NAVIGATION_CONTEXT_KEY, type NavigationState } from "./navigation-state.svelte";

	let {
		previewKey,
		href = "#",
		external = false,
		children,
		description,
		class: className,
	}: {
		previewKey: string;
		href?: string;
		external?: boolean;
		children: Snippet;
		description?: Snippet;
		class?: string;
	} = $props();

	const navState = getContext<NavigationState>(NAVIGATION_CONTEXT_KEY);
	let active = $derived(navState.hoveredItemKey === previewKey);

	function hover() {
		navState.setHoveredItem(previewKey);
	}
</script>

<a
	{href}
	target={external ? "_blank" : undefined}
	rel={external ? "noreferrer" : undefined}
	class={cn(
		"group relative z-10 flex items-center gap-2 rounded-lg px-4 text-sm font-semibold text-primary transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
		description ? "py-3" : "h-9 py-1.5",
		active && "bg-primary/[0.04]",
		className,
	)}
	onmouseenter={hover}
	onfocus={hover}
>
	<span class="min-w-0">
		<span class="block truncate">{@render children()}</span>
		{#if description}
			<span class="block text-[11px] leading-snug font-normal text-primary/45">
				{@render description()}
			</span>
		{/if}
	</span>
	{#if external}
		<ArrowUpRightIcon
			class="ml-auto size-3 opacity-0 transition-opacity group-hover:opacity-100"
			aria-hidden="true"
		/>
	{/if}
</a>
