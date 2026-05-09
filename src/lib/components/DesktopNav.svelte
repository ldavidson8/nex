<script lang="ts">
	import { fade } from 'svelte/transition';
	import { navData } from '$lib/config/navigation';
	import { cn } from '$lib/utils';

	let { class: className }: { class?: string } = $props();

	let activeMenu = $state<string | null>(null);
	let contentHeight = $state(0);
	let contentEl = $state<HTMLElement | null>(null);
	let closeTimeout: ReturnType<typeof setTimeout>;

	function handleMouseEnter(id: string) {
		clearTimeout(closeTimeout);
		activeMenu = id;
	}

	function handleMouseLeave() {
		closeTimeout = setTimeout(() => {
			activeMenu = null;
		}, 100);
	}

	function handleDropdownEnter() {
		clearTimeout(closeTimeout);
	}
</script>

{#snippet menuContent(menuId: string)}
	{@const currentData = navData.find((d) => d.id === menuId)}
	<div
		bind:this={contentEl}
		bind:clientHeight={contentHeight}
		class="absolute top-0 left-0 w-full"
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 150 }}
	>
		<div class="mx-auto flex w-full max-w-7xl justify-between gap-8 px-8 py-8 lg:px-12">
			<div class="relative flex w-1/3 flex-col gap-1">
				{#each currentData?.columns.left || [] as item (item.href)}
					<a
						href={item.href}
						class="group flex items-center gap-4 rounded-lg px-3 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
					>
						<div class="flex flex-col">
							<span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.title}</span>
							<span class="text-sm text-zinc-500 dark:text-zinc-400">{item.desc}</span>
						</div>
					</a>
				{/each}
			</div>

			<div class="relative flex w-1/3 flex-col gap-1">
				{#each currentData?.columns.right || [] as item (item.href)}
					<a
						href={item.href}
						class="group flex items-center gap-4 rounded-lg px-3 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
					>
						<div class="flex flex-col">
							<span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.title}</span>
							<span class="text-sm text-zinc-500 dark:text-zinc-400">{item.desc}</span>
						</div>
					</a>
				{/each}
			</div>

			<div class="relative flex w-1/3 flex-col gap-1">
				{#if currentData?.feature}
					<a
						href={currentData.feature.href}
						class="group flex flex-col gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
					>
						<div class="overflow-hidden rounded-lg border border-black/5 dark:border-white/10">
							<img
								src={currentData.feature.image}
								alt={currentData.feature.title}
								class="aspect-2/1 w-full object-cover transition-transform duration-500"
							/>
						</div>
						<div>
							<p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
								{currentData.feature.title}
							</p>
							<p class="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
								{currentData.feature.desc}
							</p>
						</div>
					</a>
				{/if}
			</div>
		</div>
	</div>
{/snippet}

<div class={cn(className)} onmouseleave={handleMouseLeave} role="menubar" tabindex="-1">
	<div class="flex h-full gap-6">
		{#each navData as menu (menu.id)}
			<button
				class="flex h-16 items-center gap-2 text-sm font-medium transition-colors outline-none
                {activeMenu === menu.id
					? 'fill-zinc-900 text-zinc-900 dark:fill-white dark:text-white'
					: 'fill-zinc-500 text-zinc-500 hover:fill-zinc-900 hover:text-zinc-900 dark:fill-zinc-400 dark:text-zinc-400 dark:hover:fill-zinc-200 dark:hover:text-zinc-200'}"
				onmouseenter={() => handleMouseEnter(menu.id)}
				aria-expanded={activeMenu === menu.id}
				aria-haspopup="true"
			>
				{#if menu.icon}
					<menu.icon class="size-4 opacity-70" />
				{/if}
				{menu.label}
			</button>
		{/each}
	</div>

	<div
		class="absolute top-16 left-0 z-50 w-full overflow-hidden border-b border-zinc-200 bg-zinc-50 shadow-xl transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] dark:border-zinc-800 dark:bg-zinc-900/95 dark:backdrop-blur-sm"
		style="
            height: {activeMenu ? contentHeight : 0}px;
            opacity: {activeMenu ? 1 : 0};
            visibility: {activeMenu ? 'visible' : 'hidden'};
        "
		tabindex="0"
		onmouseenter={handleDropdownEnter}
		role="menu"
		aria-label="Navigation menu"
	>
		{#key activeMenu}
			{@render menuContent(activeMenu || '')}
		{/key}
	</div>
</div>

{#if activeMenu}
	<div
		class="fixed inset-0 z-40 bg-black/10 transition-opacity duration-300 dark:bg-black/40"
		style="top: 64px;"
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 200 }}
	></div>
{/if}
