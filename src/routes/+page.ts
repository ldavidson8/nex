import { PokeAPI } from '$lib/api';
import { randomInt } from '$lib/utils/random';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const id = randomInt(1, 1025);
	const api = new PokeAPI(fetch);
	try {
		const pokemon = await api.getPokemonById(id);
		return {
			initialPokemon: pokemon
		};
	} catch (e) {
		console.error(e);
		return {
			initialPokemon: null
		};
	}
};
