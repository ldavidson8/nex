<script lang="ts">
	import Fuse from 'fuse.js';
	import { PokemonTypes, type PokemonType } from '$lib/types';
	import { PokemonFilterState, type PokemonData } from '$lib/stores/pokemon-filter-state.svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Slider } from '$lib/components/ui/slider';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import XIcon from '@lucide/svelte/icons/x';
	import SearchIcon from '@lucide/svelte/icons/search';

	interface Props {
		pokemonList: PokemonData[];
	}

	let { pokemonList }: Props = $props();

	const filters = PokemonFilterState.get();

	// Fuse.js setup for search autocomplete
	const fuse = $derived(
		new Fuse(pokemonList, {
			keys: ['name', 'displayName'],
			threshold: 0.3
		})
	);

	// Local search input that syncs with filters but allows typing without immediate filter
	let localSearchInput = $state(filters.searchQuery);
	let showSuggestions = $state(false);
	let suggestions = $derived(
		localSearchInput.length > 0 ? fuse.search(localSearchInput).slice(0, 8) : []
	);

	function handleSearchInput(e: Event) {
		const target = e.target as HTMLInputElement;
		localSearchInput = target.value;
		showSuggestions = true;
	}

	function handleSearchSubmit() {
		filters.searchQuery = localSearchInput;
		showSuggestions = false;
	}

	function selectSuggestion(pokemon: PokemonData) {
		localSearchInput = pokemon.displayName;
		filters.searchQuery = pokemon.displayName;
		showSuggestions = false;
	}

	function clearSearch() {
		localSearchInput = '';
		filters.searchQuery = '';
	}

	// Type colors
	const typeColors: Record<PokemonType, string> = {
		normal: 'bg-gray-400',
		fire: 'bg-orange-500',
		water: 'bg-blue-500',
		grass: 'bg-green-500',
		electric: 'bg-yellow-400',
		ice: 'bg-cyan-300',
		fighting: 'bg-red-700',
		poison: 'bg-purple-500',
		ground: 'bg-amber-600',
		flying: 'bg-indigo-300',
		psychic: 'bg-pink-500',
		bug: 'bg-lime-500',
		rock: 'bg-stone-500',
		ghost: 'bg-purple-700',
		dragon: 'bg-violet-600',
		dark: 'bg-gray-700',
		steel: 'bg-slate-400',
		fairy: 'bg-pink-300'
	};

	// Generations
	const generations = [
		{ value: 'all', label: 'All Generations' },
		{ value: 'generation-i', label: 'Generation I' },
		{ value: 'generation-ii', label: 'Generation II' },
		{ value: 'generation-iii', label: 'Generation III' },
		{ value: 'generation-iv', label: 'Generation IV' },
		{ value: 'generation-v', label: 'Generation V' },
		{ value: 'generation-vi', label: 'Generation VI' },
		{ value: 'generation-vii', label: 'Generation VII' },
		{ value: 'generation-viii', label: 'Generation VIII' },
		{ value: 'generation-ix', label: 'Generation IX' }
	];

	// Stats config
	const stats = [
		{ key: 'hp', label: 'HP', max: 255 },
		{ key: 'attack', label: 'Attack', max: 255 },
		{ key: 'defense', label: 'Defense', max: 255 },
		{ key: 'specialAttack', label: 'Sp. Atk', max: 255 },
		{ key: 'specialDefense', label: 'Sp. Def', max: 255 },
		{ key: 'speed', label: 'Speed', max: 255 },
		{ key: 'total', label: 'Total', max: 800 }
	] as const;

	// Classification toggles
	const classifications = [
		{ key: 'showLegendary', label: 'Legendary' },
		{ key: 'showMythical', label: 'Mythical' },
		{ key: 'showBaby', label: 'Baby' },
		{ key: 'showRegional', label: 'Regional Forms' },
		{ key: 'showMega', label: 'Mega Evolution' },
		{ key: 'showGigantamax', label: 'Gigantamax' }
	] as const;

	function toggleType(type: PokemonType) {
		if (filters.selectedTypes.includes(type)) {
			filters.selectedTypes = filters.selectedTypes.filter((t) => t !== type);
		} else {
			filters.selectedTypes = [...filters.selectedTypes, type];
		}
	}

	function cycleClassification(key: (typeof classifications)[number]['key']) {
		const current = filters[key];
		if (current === null) {
			filters[key] = true;
		} else if (current === true) {
			filters[key] = false;
		} else {
			filters[key] = null;
		}
	}

	// Active filter count
	const activeFilterCount = $derived.by(() => {
		let count = 0;
		if (filters.searchQuery) count++;
		if (filters.selectedTypes.length > 0) count++;
		if (filters.selectedGeneration !== 'all') count++;
		if (filters.showLegendary !== null) count++;
		if (filters.showMythical !== null) count++;
		if (filters.showBaby !== null) count++;
		if (filters.showRegional !== null) count++;
		if (filters.showMega !== null) count++;
		if (filters.showGigantamax !== null) count++;
		// Check stats
		for (const stat of stats) {
			const range = filters.statRanges[stat.key];
			if (range[0] > 0 || range[1] < stat.max) count++;
		}
		return count;
	});
</script>

<div class="flex flex-col gap-4">
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-semibold">
			Filters
			{#if activeFilterCount > 0}
				<Badge variant="secondary" class="ml-2">{activeFilterCount}</Badge>
			{/if}
		</h2>
		{#if filters.hasActiveFilters}
			<Button variant="ghost" size="sm" onclick={() => filters.reset()}>
				<XIcon class="mr-1 size-4" />
				Clear all
			</Button>
		{/if}
	</div>

	<Accordion.Root type="multiple" value={['search', 'types']}>
		<!-- Search Section -->
		<Accordion.Item value="search">
			<Accordion.Trigger>Search</Accordion.Trigger>
			<Accordion.Content>
				<div class="relative">
					<div class="relative">
						<SearchIcon
							class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
						/>
						<Input
							type="text"
							placeholder="Search Pokemon..."
							value={localSearchInput}
							oninput={handleSearchInput}
							onfocus={() => (showSuggestions = true)}
							onblur={() => setTimeout(() => (showSuggestions = false), 200)}
							onkeydown={(e) => e.key === 'Enter' && handleSearchSubmit()}
							class="pl-9"
						/>
					</div>
					{#if !showSuggestions && suggestions.length > 0}
						<div
							class="bg-popover border-border absolute z-100 mt-1 w-full rounded-md border shadow-lg"
						>
							<ScrollArea class="max-h-64">
								{#each suggestions as result (result.item.id)}
									<button
										type="button"
										class="hover:bg-accent flex w-full items-center gap-3 px-3 py-2 text-left text-sm"
										onmousedown={() => selectSuggestion(result.item)}
									>
										<img
											src={result.item.sprites.default}
											alt={result.item.displayName}
											class="size-8"
										/>
										<span>{result.item.displayName}</span>
										<span class="text-muted-foreground">#{result.item.id}</span>
									</button>
								{/each}
							</ScrollArea>
						</div>
					{/if}
				</div>
			</Accordion.Content>
		</Accordion.Item>

		<!-- Types Section -->
		<Accordion.Item value="types">
			<Accordion.Trigger>
				Types
				{#if filters.selectedTypes.length > 0}
					<Badge variant="secondary" class="ml-2">{filters.selectedTypes.length}</Badge>
				{/if}
			</Accordion.Trigger>
			<Accordion.Content>
				<div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
					{#each PokemonTypes as type (type)}
						{@const isSelected = filters.selectedTypes.includes(type)}
						<button
							type="button"
							class="flex items-center gap-2 rounded-md border p-2 text-sm capitalize transition-colors {isSelected
								? 'border-primary bg-primary/10'
								: 'border-border hover:bg-accent'}"
							onclick={() => toggleType(type)}
						>
							<span class="size-3 rounded-full {typeColors[type]}"></span>
							{type}
						</button>
					{/each}
				</div>
			</Accordion.Content>
		</Accordion.Item>

		<!-- Generation Section -->
		<Accordion.Item value="generation">
			<Accordion.Trigger>
				Generation
				{#if filters.selectedGeneration !== 'all'}
					<Badge variant="secondary" class="ml-2">1</Badge>
				{/if}
			</Accordion.Trigger>
			<Accordion.Content>
				<div class="grid grid-cols-2 gap-2">
					{#each generations as gen (gen.value)}
						{@const isSelected = filters.selectedGeneration === gen.value}
						<button
							type="button"
							class="rounded-md border p-2 text-sm transition-colors {isSelected
								? 'border-primary bg-primary/10'
								: 'border-border hover:bg-accent'}"
							onclick={() => (filters.selectedGeneration = gen.value)}
						>
							{gen.label}
						</button>
					{/each}
				</div>
			</Accordion.Content>
		</Accordion.Item>

		<!-- Classifications Section -->
		<Accordion.Item value="classifications">
			<Accordion.Trigger>
				Classifications
				{#if filters.showLegendary !== null || filters.showMythical !== null || filters.showBaby !== null || filters.showRegional !== null || filters.showMega !== null || filters.showGigantamax !== null}
					<Badge variant="secondary" class="ml-2">!</Badge>
				{/if}
			</Accordion.Trigger>
			<Accordion.Content>
				<div class="space-y-3">
					{#each classifications as item (item.key)}
						{@const value = filters[item.key]}
						<div class="flex items-center justify-between">
							<Label class="text-sm">{item.label}</Label>
							<div class="flex items-center gap-2">
								<Checkbox
									checked={value === true}
									indeterminate={value === null}
									onclick={() => cycleClassification(item.key)}
								/>
								<span class="text-muted-foreground w-12 text-xs">
									{value === null ? 'Any' : value ? 'Yes' : 'No'}
								</span>
							</div>
						</div>
					{/each}
				</div>
				<p class="text-muted-foreground mt-3 text-xs">Click to cycle: Any → Yes → No → Any</p>
			</Accordion.Content>
		</Accordion.Item>

		<!-- Stats Section -->
		<Accordion.Item value="stats">
			<Accordion.Trigger>Stats</Accordion.Trigger>
			<Accordion.Content>
				<div class="space-y-6">
					{#each stats as stat (stat.key)}
						{@const range = filters.statRanges[stat.key]}
						<div class="space-y-2">
							<div class="flex items-center justify-between">
								<Label class="text-sm">{stat.label}</Label>
								<span class="text-muted-foreground text-xs">
									{range[0]} - {range[1]}
								</span>
							</div>
							<Slider
								type="multiple"
								value={[...range]}
								onValueChange={(v: number[]) => {
									if (v && v.length === 2) {
										filters.setStatRange(stat.key, [v[0], v[1]]);
									}
								}}
								max={stat.max}
								min={0}
								step={1}
							/>
						</div>
					{/each}
				</div>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</div>
