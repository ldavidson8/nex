<script lang="ts">
	import { getContext, type Snippet } from "svelte";
	import { cn } from "$lib/utils/cn";
	import { NAVIGATION_CONTEXT_KEY, type NavigationState } from "./navigation-state.svelte";

	let {
		children,
		class: className,
	}: {
		children: Snippet;
		class?: string;
	} = $props();

	const navState = getContext<NavigationState>(NAVIGATION_CONTEXT_KEY);
	let active = $derived(Boolean(navState.activeTriggerId));
	let offset = $derived(
		navState.activeTriggerId ? (navState.triggerOffsets.get(navState.activeTriggerId) ?? 0) : 0,
	);
	let slideTransition = $derived(
		navState.activatedOnce && active && navState.previousTriggerId !== null
			? "left 250ms cubic-bezier(0.4, 0, 0.2, 1)"
			: "none",
	);
	let contentTransition = $derived(
		navState.activatedOnce ? "opacity 180ms, height 250ms cubic-bezier(0.4, 0, 0.2, 1)" : "none",
	);

	let hasPreview = $derived(navState.activeHasPreview);
	let innerWidth = $derived(hasPreview ? "700px" : "220px");
	let innerHeight = $derived(navState.activeHeight);
</script>

<div
	role="presentation"
	class={cn("absolute top-full z-50 pt-2", className)}
	style:left={`${offset}px`}
	style:pointer-events={active ? "auto" : "none"}
	style:transition={slideTransition}
	onmouseenter={navState.cancelClose}
	onmouseleave={navState.scheduleClose}
>
	<div
		class="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-xl shadow-black/10"
		style:opacity={active ? 1 : 0}
		style:pointer-events={active ? "auto" : "none"}
		style:width={active ? innerWidth : "220px"}
		style:height={innerHeight ? `${innerHeight}px` : undefined}
		style:transition={contentTransition}
	>
		{@render children()}
	</div>
</div>
