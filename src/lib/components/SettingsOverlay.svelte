<script lang="ts">
	import { AppState } from '$lib/stores/app-state.svelte';
	import * as Select from '$lib/components/ui/select';
	import { Sparkles, History } from '@lucide/svelte';

	const appState = AppState.get();

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

	const currentGenLabel = $derived(generations.find((g) => g.value === appState.generation)?.label);
	const currentShinyLabel = $derived(shinyModes.find((s) => s.value === appState.shinyMode)?.label);
</script>

<div class="grid gap-6 p-4">
	<div class="space-y-2">
		<div class="flex items-center gap-2 text-sm font-medium">
			<History class="size-4 opacity-70" />
			<span>Preferred Generation</span>
		</div>
		<Select.Root type="single" bind:value={appState.generation}>
			<Select.Trigger class="w-full">
				{currentGenLabel}
			</Select.Trigger>
			<Select.Content>
				{#each generations as gen (gen.value)}
					<Select.Item value={gen.value}>{gen.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<p class="text-muted-foreground text-[10px]">Sets the default sprites and data context.</p>
	</div>

	<div class="space-y-2">
		<div class="flex items-center gap-2 text-sm font-medium">
			<Sparkles class="size-4 text-yellow-500" />
			<span>Shiny Sprites</span>
		</div>
		<Select.Root type="single" bind:value={appState.shinyMode}>
			<Select.Trigger class="w-full">
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
