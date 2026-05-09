import * as v from 'valibot';
import { NamedResourceSchema } from './shared';

export const PokemonSpeciesSchema = v.object({
	id: v.number(),
	name: v.string(),
	flavor_text_entries: v.array(
		v.object({
			flavor_text: v.string(),
			language: NamedResourceSchema,
			version: NamedResourceSchema
		})
	),
	genera: v.array(
		v.object({
			genus: v.string(),
			language: NamedResourceSchema
		})
	),
	varieties: v.array(
		v.object({
			is_default: v.boolean(),
			pokemon: NamedResourceSchema
		})
	),
	evolution_chain: v.object({
		url: v.string()
	})
});

export type PokemonSpecies = v.InferOutput<typeof PokemonSpeciesSchema>;
