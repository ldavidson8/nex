import type { PokemonData } from '$lib/stores/pokemon-filter-state.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch('/pokemon-data.min.json');
	const pokemonList: PokemonData[] = await response.json();

	return {
		pokemonList
	};
};
