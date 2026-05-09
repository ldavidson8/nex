import { createQuery } from '@tanstack/svelte-query';
import { getPokemonList, type PokemonListItem } from '$lib/api';

export function pokemonListQuery() {
	return createQuery<PokemonListItem[]>(() => ({
		queryKey: ['pokemon'],
		queryFn: getPokemonList,
		staleTime: 1000 * 60 * 60 * 24, // 24 hours
		gcTime: 1000 * 60 * 60 * 24 * 7 // 7 days
	}));
}
