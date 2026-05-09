import * as v from 'valibot';
import type { NameUrl } from './schemas/shared';
import { PokemonListResultSchema, PokemonDetailSchema } from './schemas/pokemon';
import { PokemonSpeciesSchema } from './schemas/species';
import { EvolutionChainSchema } from './schemas/evolution';

// --- Types ---
export type PokemonDetail = v.InferOutput<typeof PokemonDetailSchema>;
export type PokemonSpecies = v.InferOutput<typeof PokemonSpeciesSchema>;
export type EvolutionChain = v.InferOutput<typeof EvolutionChainSchema>;
export type PokemonListItem = NameUrl & { id: number };

export class PokeAPI {
	private fetch: typeof fetch;
	private baseUrl = 'https://pokeapi.co/api/v2';

	constructor(customFetch: typeof fetch = fetch) {
		this.fetch = customFetch;
	}

	async getPokemonList(): Promise<PokemonListItem[]> {
		const res = await this.fetch(`${this.baseUrl}/pokemon?limit=10000`);
		const json = await res.json();
		const data = v.parse(PokemonListResultSchema, json);

		return data.results.map((pokemon: NameUrl) => {
			const id = pokemon.url.split('/').filter(Boolean).pop();
			return {
				...pokemon,
				id: id ? parseInt(id) : 0
			};
		});
	}

	async getPokemonById(id: string | number): Promise<PokemonDetail> {
		const res = await this.fetch(`${this.baseUrl}/pokemon/${id}`);
		if (!res.ok) throw new Error(`Pokemon not found: ${id}`);
		const json = await res.json();
		return v.parse(PokemonDetailSchema, json);
	}

	async getPokemonSpecies(idOrName: string | number): Promise<PokemonSpecies> {
		const res = await this.fetch(`${this.baseUrl}/pokemon-species/${idOrName}`);
		if (!res.ok) throw new Error(`Species not found: ${idOrName}`);
		const json = await res.json();
		return v.parse(PokemonSpeciesSchema, json);
	}
}
