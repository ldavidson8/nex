<script lang="ts">
	import { getContext, type Snippet } from "svelte";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import { cn } from "$lib/utils/cn";
	import { NAVIGATION_CONTEXT_KEY, type NavigationState } from "./navigation-state.svelte";

	let {
		id,
		href,
		children,
		class: className,
	}: {
		id: string;
		href?: string;
		children: Snippet;
		class?: string;
	} = $props();

	const navState = getContext<NavigationState>(NAVIGATION_CONTEXT_KEY);
	let element: HTMLAnchorElement | HTMLButtonElement | undefined;
	let active = $derived(navState.activeTriggerId === id);

	function registerElement(node: HTMLAnchorElement | HTMLButtonElement) {
		element = node;

		return () => {
			if (element === node) {
				element = undefined;
			}
		};
	}

	function open() {
		if (!element) return;

		navState.registerTrigger(id, element.offsetLeft);
		navState.open(id);
	}

	function close() {
		navState.scheduleClose();
	}
</script>

<li>
	{#if href}
		<a
			{@attach registerElement}
			{href}
			class={cn(
				"flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-primary/55 transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
				active && "bg-primary/4 text-primary",
				className,
			)}
			aria-expanded={active}
			onmouseenter={open}
			onfocus={open}
			onmouseleave={close}
			onblur={close}
		>
			{@render children()}
			<ChevronDownIcon class="size-3" aria-hidden="true" />
		</a>
	{:else}
		<button
			{@attach registerElement}
			type="button"
			class={cn(
				"flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-primary/55 transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
				active && "bg-primary/4 text-primary",
				className,
			)}
			aria-expanded={active}
			onmouseenter={open}
			onfocus={open}
			onmouseleave={close}
			onblur={close}
		>
			{@render children()}
			<ChevronDownIcon class="size-3" aria-hidden="true" />
		</button>
	{/if}
</li>
