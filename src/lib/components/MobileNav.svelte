<script lang="ts">
	import { page } from '$app/state';
	import { navData } from '$lib/config/navigation';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Select from '$lib/components/ui/select';
	import { AppState } from '$lib/stores/app-state.svelte';
	import { History, Sparkles, MenuIcon } from '@lucide/svelte';

	let { class: className }: { class?: string } = $props();
	let open = $state(false);

	const appState = AppState.get();

	$effect(() => {
		if (page.url) {
			open = false;
		}
	});

	const generations = [
		{ value: 'generation-i', label: 'Gen 1: Kanto' },
		{ value: 'generation-ii', label: 'Gen 2: Johto' },
		{ value: 'generation-iii', label: 'Gen 3: Hoenn' },
		{ value: 'generation-iv', label: 'Gen 4: Sinnoh' },
		{ value: 'generation-v', label: 'Gen 5: Unova' },
		{ value: 'generation-vi', label: 'Gen 6: Kalos' },
		{ value: 'generation-vii', label: 'Gen 7: Alola' },
		{ value: 'generation-viii', label: 'Gen 8: Galar' },
		{ value: 'generation-ix', label: 'Gen 9: Paldea' }
	];

	const shinyModes = [
		{ value: 'never', label: 'Never' },
		{ value: 'always', label: 'Always' },
		{ value: 'random', label: 'Random (1/4096)' }
	];

	const currentGenLabel = $derived(
		generations.find((g) => g.value === appState.generation)?.label ?? 'Select Gen'
	);
	const currentShinyLabel = $derived(
		shinyModes.find((s) => s.value === appState.shinyMode)?.label ?? 'Select Mode'
	);
</script>

<div class={cn(className)}>
	<Sheet.Root bind:open>
		<Sheet.Trigger>
			{#snippet child({ props })}
				<Button variant="ghost" size="icon" {...props}>
					<MenuIcon class="size-6" />
					<span class="sr-only">Toggle menu</span>
				</Button>
			{/snippet}
		</Sheet.Trigger>
		<Sheet.Content side="left" class="flex w-75 flex-col pr-0 sm:w-100">
			<Sheet.Header class="px-6 text-left">
				<Sheet.Title>Menu</Sheet.Title>
				<Sheet.Description>Navigate the Pokémon universe.</Sheet.Description>
			</Sheet.Header>

			<div class="mt-4 flex-1 overflow-y-auto">
				<Accordion.Root type="multiple" class="w-full">
					{#each navData as category (category.id)}
						<Accordion.Item value={category.id} class="border-b-0">
							<Accordion.Trigger
								class="hover:bg-muted/50 px-6 py-3 text-base transition-colors hover:no-underline"
							>
								<div class="flex items-center gap-3">
									{#if category.icon}
										<category.icon class="size-5 opacity-70" />
									{/if}
									{category.label}
								</div>
							</Accordion.Trigger>
							<Accordion.Content>
								<div class="bg-muted/20 flex flex-col pb-2">
									{#each [...category.columns.left, ...category.columns.right] as item (item.href)}
										<a
											href={item.href}
											class="hover:bg-muted/50 flex flex-col gap-1 px-10 py-3 text-sm transition-colors"
										>
											<span class="text-foreground font-medium">{item.title}</span>
											<span class="text-muted-foreground text-xs">{item.desc}</span>
										</a>
									{/each}

									{#if category.feature}
										<a
											href={category.feature.href}
											class="text-primary mt-2 flex items-center gap-3 px-10 py-3 text-sm font-semibold"
										>
											<Sparkles class="size-4" />
											{category.feature.title}
										</a>
									{/if}
								</div>
							</Accordion.Content>
						</Accordion.Item>
					{/each}
				</Accordion.Root>
			</div>

			<div class="bg-muted/30 mt-auto border-t pb-8">
				<div class="grid gap-4 px-6 py-6">
					<h4 class="text-muted-foreground text-xs font-bold tracking-widest uppercase">
						App Settings
					</h4>

					<div class="space-y-2">
						<div class="flex items-center gap-2 text-sm font-medium">
							<History class="size-4 opacity-70" />
							<span>Preferred Generation</span>
						</div>
						<Select.Root type="single" bind:value={appState.generation}>
							<Select.Trigger class="bg-background w-full">
								{currentGenLabel}
							</Select.Trigger>
							<Select.Content>
								{#each generations as gen (gen.value)}
									<Select.Item value={gen.value}>{gen.label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>

					<div class="space-y-2">
						<div class="flex items-center gap-2 text-sm font-medium">
							<Sparkles class="size-4 text-yellow-500" />
							<span>Shiny Sprites</span>
						</div>
						<Select.Root type="single" bind:value={appState.shinyMode}>
							<Select.Trigger class="bg-background w-full">
								{currentShinyLabel}
							</Select.Trigger>
							<Select.Content>
								{#each shinyModes as mode (mode.value)}
									<Select.Item value={mode.value}>{mode.label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
				</div>
			</div>
		</Sheet.Content>
	</Sheet.Root>
</div>
