<script lang="ts">
	import { formatId } from '$lib/utils/formatId';
	import * as Card from '$lib/components/ui/card';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<Seo title="Pokedex - Nex" />

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Pokémon</h1>

	{#if data.pokemonList}
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
			{#each data.pokemonList as pokemon (pokemon.id)}
				<a href="/pokemon/{pokemon.name}">
					<Card.Root class="hover:border-primary transition-colors">
						<Card.Header class="items-center">
							<img
								src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{pokemon.id}.png"
								alt={pokemon.name}
								class="size-24"
							/>
							<Card.Title class="capitalize">{pokemon.name}</Card.Title>
							<Card.Description>#{formatId(pokemon.id)}</Card.Description>
						</Card.Header>
					</Card.Root>
				</a>
			{/each}
		</div>
	{:else}
		<p>No Pokemon found.</p>
	{/if}
</div>
