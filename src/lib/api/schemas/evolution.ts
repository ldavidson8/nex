import * as v from 'valibot';
import { NamedResourceSchema, type NameUrl } from './shared';

export const EvolutionDetailSchema = v.object({
	trigger: NamedResourceSchema,
	min_level: v.nullable(v.number()),
	item: v.nullable(NamedResourceSchema)
});

export type ChainLink = {
	is_baby: boolean;
	species: NameUrl;
	evolution_details: v.InferOutput<typeof EvolutionDetailSchema>[];
	evolves_to: ChainLink[];
};

export const ChainLinkSchema: v.GenericSchema<ChainLink> = v.object({
	is_baby: v.boolean(),
	species: NamedResourceSchema,
	evolution_details: v.array(EvolutionDetailSchema),
	evolves_to: v.array(v.lazy(() => ChainLinkSchema))
});

export const EvolutionChainSchema = v.object({
	id: v.number(),
	chain: ChainLinkSchema
});
