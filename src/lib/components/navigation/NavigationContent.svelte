<script lang="ts">
	import { getContext, type Snippet } from "svelte";
	import { cn } from "$lib/utils/cn";
	import { NAVIGATION_CONTEXT_KEY, type NavigationState } from "./navigation-state.svelte";

	let {
		triggerId,
		sidebar,
		preview,
		footer,
		class: className,
	}: {
		triggerId: string;
		sidebar: Snippet;
		preview?: Snippet<[string | null]>;
		footer?: Snippet;
		class?: string;
	} = $props();

	const navState = getContext<NavigationState>(NAVIGATION_CONTEXT_KEY);
	let active = $derived(navState.activeTriggerId === triggerId);

	let sidebarEl = $state<HTMLElement | undefined>();
	let previewEl = $state<HTMLElement | undefined>();

	$effect(() => {
		navState.registerContent(triggerId, !!preview);
	});

	$effect(() => {
		const measure = () => {
			const sidebarH = sidebarEl?.scrollHeight ?? 0;
			const previewH = previewEl?.scrollHeight ?? 0;
			navState.registerContentHeight(triggerId, Math.max(sidebarH, previewH));
		};

		const ro = new ResizeObserver(measure);
		if (sidebarEl) ro.observe(sidebarEl);
		if (previewEl) ro.observe(previewEl);
		measure();

		return () => ro.disconnect();
	});
</script>

<div
	data-navigation-content={triggerId}
	data-active={active}
	class={cn("absolute inset-x-0 top-0", className)}
	style:opacity={active ? 1 : 0}
	style:pointer-events={active ? "auto" : "none"}
	style:transition={navState.activatedOnce ? "opacity 150ms" : "none"}
>
	<div bind:this={sidebarEl} class="w-[220px]">
		<div class="px-2 py-2">
			<div class="relative">
				{@render sidebar()}
			</div>
		</div>
		{#if footer}
			<div class="px-1.5 pb-2">
				<div class="overflow-hidden rounded-lg border-t border-border/60 bg-primary/2">
					{@render footer()}
				</div>
			</div>
		{/if}
	</div>
</div>

{#if preview}
	<div
		bind:this={previewEl}
		data-navigation-preview={triggerId}
		data-active={active}
		class="absolute top-0 left-[220px] w-[480px] p-3"
		style:opacity={active ? 1 : 0}
		style:pointer-events={active ? "auto" : "none"}
		style:transition={navState.activatedOnce ? "opacity 150ms" : "none"}
	>
		{@render preview(navState.hoveredItemKey)}
	</div>
{/if}
