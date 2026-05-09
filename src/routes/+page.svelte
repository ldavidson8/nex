<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import { PokemonTypes } from '$lib/types';
	import { PokeAPI } from '$lib/api';
	import { randomInt } from '$lib/utils/random';
	import { getTypeColor } from '$lib/utils/getTypeColor';
	import { getTypeIcon } from '$lib/utils/getTypeIcon';
	import { cn } from '$lib/utils';
	import { formatId } from '$lib/utils/formatId';

	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { Skeleton } from '$lib/components/ui/skeleton';

	import { ArrowRight, Dna, Sword, Sparkles, Backpack, RefreshCw } from '@lucide/svelte';

	let currentId = $state(randomInt(1, 1025));

	const pokemonQuery = createQuery(() => ({
		queryKey: ['random-pokemon', currentId],
		queryFn: () => {
			const api = new PokeAPI();
			return api.getPokemonById(currentId);
		},
		staleTime: Infinity,
		refetchOnWindowFocus: false
	}));

	let pokemon = $derived(pokemonQuery.data);
	let isLoading = $derived(pokemonQuery.isLoading);
	let isRefetching = $derived(pokemonQuery.isRefetching);

	function shufflePokemon() {
		let newId;
		do {
			newId = randomInt(1, 1025);
		} while (newId === currentId);
		currentId = newId;
	}

	const quickLinks = [
		{ title: 'Pokedex', icon: Dna, href: '/pokemon', desc: 'Browse all', color: 'text-blue-500' },
		{ title: 'Moves', icon: Sword, href: '/moves', desc: 'Attacks', color: 'text-red-500' },
		{
			title: 'Abilities',
			icon: Sparkles,
			href: '/abilities',
			desc: 'Passives',
			color: 'text-yellow-500'
		},
		{ title: 'Items', icon: Backpack, href: '/items', desc: 'Held Items', color: 'text-green-500' }
	];
</script>

<div class="mx-auto max-w-7xl px-3 pt-16 pb-20 sm:px-6 sm:pt-20">
	<div class="mb-16">
		<div class="mb-3 flex items-center justify-between sm:mb-4">
			<Button
				variant="ghost"
				size="sm"
				onclick={shufflePokemon}
				disabled={isLoading || isRefetching}
				class="text-muted-foreground hover:text-foreground h-8 px-2 text-xs sm:h-9 sm:px-4 sm:text-sm"
			>
				<RefreshCw
					class={cn(
						'mr-1.5 size-3.5 sm:mr-2 sm:size-4',
						(isLoading || isRefetching) && 'animate-spin'
					)}
				/>
				Shuffle
			</Button>
		</div>
		<a href={pokemon ? `/pokemon/${pokemon.name}` : '#'} class="group block h-full">
			<div
				class={cn(
					'relative flex h-full min-h-80 flex-col overflow-hidden rounded-3xl transition-all duration-200 sm:min-h-100 ',
					!pokemon ? 'bg-muted' : getTypeColor(pokemon.types[0].type.name),
					pokemon && 'active:scale-[0.98] lg:hover:scale-[1.01] lg:hover:shadow-xl'
				)}
			>
				{#if pokemon}
					<span
						class="absolute -top-4 -right-4 text-[6rem] leading-none font-bold text-white/10 uppercase select-none sm:-top-10 sm:-right-1 sm:text-[12rem]"
					>
						{pokemon.types[0].type.name}
					</span>
					<div class="relative z-10 flex h-full flex-col justify-between p-5 text-white sm:p-8">
						<div>
							<div class="flex items-center justify-between">
								<Badge
									variant="secondary"
									class="bg-white/20 px-2 py-0.5 text-xs text-white backdrop-blur-md hover:bg-white/30 sm:px-2.5 sm:py-0.5 sm:text-sm"
								>
									#{formatId(pokemon.id)}
								</Badge>
								<div class="flex gap-1.5 sm:gap-2">
									{#each pokemon.types as t (t.type.name)}
										{@const Icon = getTypeIcon(t.type.name)}
										<div
											class="grid size-6 place-items-center rounded-full bg-white/20 backdrop-blur-md sm:size-8"
											title={t.type.name}
										>
											{#if Icon}
												<Icon class="size-3.5 sm:size-5" />
											{/if}
										</div>
									{/each}
								</div>
							</div>

							{#key pokemon.id}
								<h1
									class="animate-in fade-in slide-in-from-bottom-2 mt-2 text-4xl font-extrabold capitalize drop-shadow-sm sm:mt-4 sm:text-7xl"
								>
									{pokemon.name}
								</h1>
							{/key}
						</div>

						<div class="mt-auto flex items-end justify-between gap-4">
							<Button variant="ghost" size="sm">
								View Details <ArrowRight class="ml-1.5 size-3.5 sm:ml-2 sm:size-4" />
							</Button>

							{#key pokemon.id}
								<img
									src={pokemon.sprites.other['official-artwork'].front_default ||
										pokemon.sprites.front_default}
									alt={pokemon.name}
									class="animate-in zoom-in-50 max-h-64 w-auto object-contain drop-shadow-2xl transition-all duration-300 lg:group-hover:scale-110"
								/>
							{/key}
						</div>
					</div>
				{:else}
					<div class="relative z-10 flex h-full flex-col justify-between p-5 sm:p-8">
						<div class="space-y-4">
							<div class="flex justify-between">
								<Skeleton class="h-6 w-12 rounded-full bg-white/20 sm:w-16" />
								<div class="flex gap-2">
									<Skeleton class="size-6 rounded-full bg-white/20 sm:size-8" />
									<Skeleton class="size-6 rounded-full bg-white/20 sm:size-8" />
								</div>
							</div>
							<Skeleton class="h-10 w-3/4 rounded-lg bg-white/20 sm:h-16" />
						</div>

						<div class="flex items-end justify-between">
							<Skeleton class="h-9 w-24 rounded-md bg-white/20 sm:h-10 sm:w-32" />
							<Skeleton class="size-32 rounded-xl bg-white/20 sm:size-48" />
						</div>
					</div>
				{/if}
			</div>
		</a>
	</div>
	<section class="mb-12 sm:mb-16">
		<h3 class="mb-4 text-lg font-bold sm:mb-6 sm:text-xl">Explore the Database</h3>
		<div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
			{#each quickLinks as link (link.title)}
				<a href={link.href} class="group">
					<Card
						class="lg:hover:border-primary/50 lg:hover:bg-muted/20 h-full transition-colors active:scale-[0.98]"
					>
						<CardContent
							class="flex flex-col items-center gap-2 p-4 text-center sm:flex-row sm:p-6 sm:text-left"
						>
							<div
								class={cn(
									'bg-muted group-hover:bg-background grid size-10 place-items-center rounded-full transition-colors sm:size-12',
									link.color
								)}
							>
								<link.icon class="size-5 sm:size-6" />
							</div>
							<div>
								<h4 class="text-sm font-bold sm:text-base">{link.title}</h4>
								<p class="text-muted-foreground hidden text-xs sm:block">{link.desc}</p>
							</div>
						</CardContent>
					</Card>
				</a>
			{/each}
		</div>
	</section>

	<Separator class="my-8 sm:my-12" />

	<section>
		<div class="mb-4 flex items-center justify-between sm:mb-6">
			<h3 class="text-lg font-bold sm:text-xl">Type Matchups</h3>
			<Button variant="link" href="/types" class="h-auto px-0 text-sm">View Chart</Button>
		</div>

		<div class="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-6 lg:grid-cols-9">
			{#each PokemonTypes as type (type)}
				{@const Icon = getTypeIcon(type)}
				<a
					href="/types/{type}"
					class={cn(
						'flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 transition-all active:scale-95 sm:gap-2 sm:p-4 lg:hover:-translate-y-1 lg:hover:shadow-md',
						'active:bg-muted/50 lg:hover:bg-muted/50'
					)}
				>
					<div
						class={cn(
							'grid size-8 place-items-center rounded-full text-white sm:size-10',
							getTypeColor(type)
						)}
					>
						{#if Icon}
							<Icon class="size-4 sm:size-6" />
						{/if}
					</div>
					<span class="text-[10px] font-medium capitalize sm:text-xs">{type}</span>
				</a>
			{/each}
		</div>
	</section>
</div>
