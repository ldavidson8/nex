<script lang="ts">
	import type { Snippet } from "svelte";

	interface NavItem {
		label: string;
		href: string;
		external?: boolean;
	}

	let {
		id,
		title,
		titleHref = "#",
		items = [],
		columns = 2,
		activeDropdown = $bindable(null),
		trigger,
		class: className = "",
	}: {
		id: string;
		title: string;
		titleHref?: string;
		items?: NavItem[];
		columns?: 1 | 2;
		activeDropdown?: string | null;
		trigger?: Snippet;
		class?: string;
	} = $props();

	let closeTimer: ReturnType<typeof setTimeout> | null = null;
	let expanded = $derived(activeDropdown === id);

	function open() {
		if (closeTimer) {
			clearTimeout(closeTimer);
			closeTimer = null;
		}
		activeDropdown = id;
	}

	function scheduleClose() {
		closeTimer = setTimeout(() => {
			if (activeDropdown === id) activeDropdown = null;
		}, 150);
	}

	function cancelClose() {
		if (closeTimer) {
			clearTimeout(closeTimer);
			closeTimer = null;
		}
	}

	$effect(() => {
		return () => {
			if (closeTimer) clearTimeout(closeTimer);
		};
	});
</script>

<li class="relative {className}">
	<a
		class="nav__btn flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-background transition-colors duration-200"
		onmouseenter={open}
		onmouseleave={scheduleClose}
		href={items.length ? undefined : titleHref}
		role={items.length ? "button" : undefined}
		aria-expanded={items.length ? expanded : undefined}
		aria-haspopup={items.length ? "true" : undefined}
		onclick={(e) => {
			if (items.length) {
				e.preventDefault();
				expanded ? (activeDropdown = null) : open();
			}
		}}
	>
		{#if trigger}
			{@render trigger()}
		{:else}
			{title}
		{/if}

		{#if items.length}
			<svg
				class="h-3.5 w-3.5 opacity-50 transition-transform duration-200 {expanded
					? 'rotate-180'
					: ''}"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					fill-rule="evenodd"
					d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
					clip-rule="evenodd"
				/>
			</svg>
		{/if}
	</a>

	{#if items.length}
		<div
			id="dropdown-{id}"
			class="absolute top-full left-0 z-50 pt-3 transition-all duration-200
        {expanded
				? 'visible translate-y-0 opacity-100'
				: 'pointer-events-none invisible -translate-y-1 opacity-0'}"
			role="region"
			aria-label="{title} navigation"
			onmouseenter={cancelClose}
			onmouseleave={scheduleClose}
		>
			<div
				class="min-w-[16rem] rounded-none border border-zinc-800 bg-foreground p-1.5 shadow-2xl shadow-black/80"
			>
				<ul class="grid gap-x-1 {columns === 1 ? 'grid-cols-1' : 'grid-cols-[repeat(2,auto)]'}">
					{#each items as item (item.label)}
						<li class="min-w-32">
							<a
								class="flex items-center gap-1 rounded-none px-3 py-1.5 text-sm text-background
                  transition-colors duration-200 outline-none
                  hover:bg-zinc-900 hover:text-white
                  focus-visible:ring-1 focus-visible:ring-zinc-700"
								href={item.href}
								target={item.external ? "_blank" : undefined}
								rel={item.external ? "noopener noreferrer" : undefined}
							>
								{item.label}
								{#if item.external}
									<span class="text-[9px] text-zinc-600" aria-hidden="true">&nbsp;↗</span>
								{/if}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}
</li>
