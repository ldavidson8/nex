<script lang="ts">
	import { goto } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';
	import { createQuery } from '@tanstack/svelte-query';
	import { PokeAPI, type PokemonSpecies } from '$lib/api';
	import {
		ChevronLeft,
		ChevronRight,
		Play,
		Pause,
		Ruler,
		Weight,
		Activity,
		Swords,
		Dna,
		Sparkles
	} from '@lucide/svelte';
	import { extractIdFromUrl } from '$lib/utils/extractIdFromUrl';
	import { formatId } from '$lib/utils/formatId';
	import { cn } from '$lib/utils/cn';
	import { getTypeColor } from '$lib/utils/getTypeColor';
	import { formatPokemonName } from '$lib/utils/formatPokemonName';

	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';
	import { Separator } from '$lib/components/ui/separator';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import Seo from '$lib/components/Seo.svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const pokemonQuery = createQuery(() => ({
		queryKey: ['pokemon', data.name],
		queryFn: () => {
			const api = new PokeAPI();
			return api.getPokemonById(data.name);
		},
		staleTime: 1000 * 60 * 5
	}));

	const speciesQuery = createQuery<PokemonSpecies>(() => ({
		queryKey: ['species', pokemonQuery.data?.species?.url],
		queryFn: () => {
			const api = new PokeAPI();
			const speciesId = extractIdFromUrl(pokemonQuery.data!.species.url);
			return api.getPokemonSpecies(speciesId);
		},
		enabled: !!pokemonQuery.data,
		staleTime: 1000 * 60 * 5
	}));

	let pokemon = $derived(pokemonQuery.data);
	let species = $derived(speciesQuery.data);
	let isLoading = $derived(pokemonQuery.isLoading || speciesQuery.isLoading);
	let isError = $derived(pokemonQuery.isError || speciesQuery.isError);

	let pageTitle = $derived(
		pokemon ? `${formatPokemonName(pokemon.name)} - Nex` : 'Loading... - Nex'
	);

	let description = $derived.by(() => {
		if (!species) return ''; // Safety check
		const entry = species.flavor_text_entries.find((e) => e.language.name === 'en');
		return entry ? entry.flavor_text.replace(/\f/g, ' ') : 'No description available.';
	});

	let genus = $derived.by(() => {
		if (!species) return '';
		return species.genera.find((g) => g.language.name === 'en')?.genus ?? '';
	});

	let audioRef = $state<HTMLAudioElement | null>(null);
	let isPlaying = $state(false);

	function toggleAudio() {
		if (!audioRef || !pokemon) return;
		if (isPlaying) {
			audioRef.pause();
			audioRef.currentTime = 0;
			isPlaying = false;
		} else {
			audioRef.volume = 0.5;
			audioRef.play();
			isPlaying = true;
		}
	}

	function handleFormChange(varietyName: string) {
		goto(`/pokemon/${varietyName}`);
	}
</script>

<Seo title={pageTitle} />

{#if isLoading}
	<div class="flex min-h-screen w-full items-center justify-center bg-neutral-900 pt-24">
		<Skeleton class="h-64 w-64 rounded-full" />
	</div>
{:else if isError || !pokemon || !species}
	<div
		class="flex min-h-screen w-full flex-col items-center justify-center bg-neutral-900 pt-24 text-white"
	>
		<h1 class="text-2xl font-bold">Error loading Pokémon</h1>
		<Button onclick={() => window.location.reload()} variant="secondary" class="mt-4"
			>Try Again</Button
		>
	</div>
{:else}
	<div
		class={cn(
			'relative min-h-screen w-full overflow-hidden pt-24 font-sans text-white transition-colors duration-500',
			getTypeColor(pokemon.types[0].type.name)
		)}
	>
		<div class="relative z-10 px-6 pb-4">
			<div class="flex items-end justify-between">
				<div>
					<h1 class="text-4xl font-bold tracking-wide capitalize drop-shadow-md">
						{pokemon.name.replace(/-/g, ' ')}
					</h1>
					<div class="mt-2 flex gap-2">
						{#each pokemon.types as t (t.type.name)}
							<Badge variant="secondary" class="bg-white/25 px-3 py-1 text-white hover:bg-white/40">
								<span class="font-bold tracking-wider capitalize">{t.type.name}</span>
							</Badge>
						{/each}
					</div>
				</div>
				<div class="text-right">
					<span class="text-3xl font-bold text-white/90">#{formatId(species.id)}</span>
					<p class="text-sm font-medium capitalize opacity-90">{genus}</p>
				</div>
			</div>
		</div>
		<div class="relative z-20 mt-4 flex h-64 w-full items-center justify-center">
			<Button
				variant="ghost"
				size="icon"
				class="absolute left-4 text-white hover:bg-white/20 hover:text-white"
			>
				<ChevronLeft class="size-8" />
			</Button>

			<div in:fly={{ y: -20, duration: 500 }} class="relative z-30 drop-shadow-2xl filter">
				{#key pokemon.id}
					<img
						in:fade
						src={pokemon.sprites.other['official-artwork'].front_default ??
							pokemon.sprites.front_default ??
							''}
						alt={pokemon.name}
						class="size-72 object-contain"
					/>
				{/key}
			</div>
			<Button
				variant="ghost"
				size="icon"
				class="absolute right-4 text-white hover:bg-white/20 hover:text-white"
			>
				<ChevronRight class="size-8" />
			</Button>
		</div>
		{#if species.varieties.length > 1}
			<div class="relative z-20 mt-8 mb-8 flex justify-center">
				<div
					class="no-scrollbar flex max-w-[90%] gap-2 overflow-x-auto rounded-full bg-black/20 px-4 py-2 backdrop-blur-md"
				>
					{#each species.varieties as variety (variety.pokemon.name)}
						<button
							onclick={() => handleFormChange(variety.pokemon.name)}
							class={cn(
								'rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap capitalize transition-all',
								pokemon.name === variety.pokemon.name
									? 'bg-white text-black shadow-lg'
									: 'text-white/80 hover:bg-white/20'
							)}
						>
							{variety.pokemon.name.replace(species.name, '').replace(/-/g, ' ').trim() ||
								'Regular'}
						</button>
					{/each}
				</div>
			</div>
		{/if}
		<Card class="relative z-10 min-h-[50vh] w-full rounded-t-[2.5rem] border-0">
			<CardContent class="mx-auto max-w-2xl space-y-8 px-6 pt-16 pb-12">
				<section class="space-y-4">
					<h2 class="text-2xl font-bold tracking-tight">About</h2>
					<p class="text-muted-foreground leading-relaxed">
						{description}
					</p>

					<!-- Audio Player -->
					{#if pokemon.cries.latest}
						<div class="bg-muted/50 border-border flex items-center gap-4 rounded-xl border p-3">
							<Button
								onclick={toggleAudio}
								size="icon"
								class="rounded-full shadow-sm transition-transform active:scale-95"
							>
								{#if isPlaying}
									<Pause size={18} />
								{:else}
									<Play size={18} class="ml-1" />
								{/if}
							</Button>
							<div class="flex-1">
								<div class="bg-muted-foreground/20 h-1.5 w-full overflow-hidden rounded-full">
									<div
										class={cn(
											'bg-primary h-full transition-all duration-2000 ease-linear',
											isPlaying ? 'w-full' : 'w-0'
										)}
									></div>
								</div>
							</div>
							<audio
								bind:this={audioRef}
								src={pokemon.cries.latest}
								onended={() => (isPlaying = false)}
							></audio>
						</div>
					{/if}
					<div class="grid grid-cols-2 gap-4">
						<div
							class="bg-muted/30 border-border flex flex-col items-center justify-center gap-1 rounded-xl border p-4"
						>
							<span
								class="text-muted-foreground flex items-center gap-1 text-xs tracking-wider uppercase"
							>
								<Ruler size={12} /> Height
							</span>
							<span class="text-lg font-medium">{(pokemon.height / 10).toFixed(1)} m</span>
						</div>
						<div
							class="bg-muted/30 border-border flex flex-col items-center justify-center gap-1 rounded-xl border p-4"
						>
							<span
								class="text-muted-foreground flex items-center gap-1 text-xs tracking-wider uppercase"
							>
								<Weight size={12} /> Weight
							</span>
							<span class="text-lg font-medium">{(pokemon.weight / 10).toFixed(1)} kg</span>
						</div>
					</div>
				</section>
				<Separator />
				<section class="space-y-6">
					<div class="flex items-center gap-2">
						<Activity class="text-muted-foreground" size={20} />
						<h2 class="text-xl font-bold tracking-tight">Base Stats</h2>
					</div>

					<div class="space-y-4">
						{#each pokemon.stats as stat (stat.stat.name)}
							<div class="flex items-center text-sm">
								<span class="text-muted-foreground w-24 shrink-0 font-medium capitalize">
									{stat.stat.name.replace('-', ' ')}
								</span>
								<span class="mr-4 w-10 text-right font-bold">{stat.base_stat}</span>
								<Progress
									value={(stat.base_stat / 255) * 100}
									class={cn(
										'h-2.5',
										stat.base_stat >= 100
											? 'bg-green-500'
											: stat.base_stat >= 60
												? 'bg-amber-400'
												: 'bg-red-500'
									)}
								/>
							</div>
						{/each}

						<!-- Total -->
						<div class="flex items-center pt-2 text-sm">
							<span class="text-foreground w-24 shrink-0 font-bold capitalize">Total</span>
							<span class="mr-4 w-10 text-right font-bold">
								{pokemon.stats.reduce((acc, curr) => acc + curr.base_stat, 0)}
							</span>
						</div>
					</div>
				</section>
				<Separator />
				<section class="space-y-6">
					<div class="flex items-center gap-2">
						<Dna class="text-muted-foreground" size={20} />
						<h2 class="text-xl font-bold tracking-tight">Evolution</h2>
					</div>

					<div
						class="bg-muted/30 border-border flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-8 text-center"
					>
						<div class="flex items-center gap-4 opacity-40">
							<Skeleton class="size-14 rounded-full" />
							<ChevronRight />
							<Skeleton class="size-16 rounded-full" />
							<ChevronRight />
							<Skeleton class="size-14 rounded-full" />
						</div>
						<p class="text-muted-foreground text-xs">
							Evolution Chain ID: {species.evolution_chain.url.split('/').filter(Boolean).pop()}
						</p>
					</div>
				</section>
				<Separator />
				<section class="space-y-6">
					<div class="flex items-center gap-2">
						<Swords class="text-muted-foreground" size={20} />
						<h2 class="text-xl font-bold tracking-tight">Moves</h2>
					</div>

					<div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
						{#each pokemon.moves.slice(0, 12) as move (move.move.name)}
							<Badge variant="outline" class="justify-center py-2 text-xs capitalize">
								{move.move.name.replace('-', ' ')}
							</Badge>
						{/each}
					</div>
					{#if pokemon.moves.length > 12}
						<div class="text-center">
							<Button variant="link" class="text-xs">
								View all {pokemon.moves.length} moves
							</Button>
						</div>
					{/if}
				</section>
				<section class="rounded-xl bg-neutral-50 p-6 dark:bg-neutral-900">
					<h3 class="mb-4 flex items-center gap-2 text-sm font-bold">
						<Sparkles size={16} class="text-yellow-500" /> Visuals
					</h3>
					<div class="grid grid-cols-2 gap-4">
						<div class="flex flex-col items-center">
							<img
								src={pokemon.sprites.versions['generation-v']['black-white'].animated.front_default}
								alt="Normal"
								class="pixelated size-48 object-contain"
							/>
							<span class="text-muted-foreground mt-2 text-xs font-medium">Normal</span>
						</div>
						<div class="flex flex-col items-center">
							<img
								src={pokemon.sprites.versions['generation-v']['black-white'].animated.front_shiny}
								alt="Shiny"
								class="pixelated size-48 object-contain"
							/>
							<span class="mt-2 text-xs font-medium text-yellow-500">Shiny</span>
						</div>
					</div>
				</section>
			</CardContent>
		</Card>
	</div>
{/if}

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
