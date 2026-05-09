import * as v from 'valibot';
import { NamedResourceSchema } from './shared';

export const SpriteSetSchema = v.object({
	back_default: v.nullable(v.string()),
	back_female: v.nullable(v.string()),
	back_shiny: v.nullable(v.string()),
	back_shiny_female: v.nullable(v.string()),
	front_default: v.nullable(v.string()),
	front_female: v.nullable(v.string()),
	front_shiny: v.nullable(v.string()),
	front_shiny_female: v.nullable(v.string())
});

export const PokemonListResultSchema = v.object({
	results: v.array(NamedResourceSchema)
});

export const PokemonDetailSchema = v.object({
	id: v.number(),
	name: v.string(),
	height: v.number(),
	weight: v.number(),
	base_experience: v.nullable(v.number()),
	types: v.array(v.object({ slot: v.number(), type: NamedResourceSchema })),
	abilities: v.array(
		v.object({ ability: NamedResourceSchema, is_hidden: v.boolean(), slot: v.number() })
	),
	stats: v.array(
		v.object({ base_stat: v.number(), effort: v.number(), stat: NamedResourceSchema })
	),
	sprites: v.object({
		front_default: v.nullable(v.string()),
		front_shiny: v.nullable(v.string()),
		other: v.object({
			'official-artwork': v.object({
				front_default: v.nullable(v.string()),
				front_shiny: v.nullable(v.string())
			}),
			home: v.object({
				front_default: v.nullable(v.string()),
				front_shiny: v.nullable(v.string())
			}),
			showdown: SpriteSetSchema
		}),
		versions: v.object({
			'generation-v': v.object({
				'black-white': v.intersect([SpriteSetSchema, v.object({ animated: SpriteSetSchema })])
			}),
			'generation-ix': v.object({
				'scarlet-violet': v.object({
					front_default: v.nullable(v.string()),
					front_female: v.nullable(v.string())
				})
			})
		})
	}),
	cries: v.object({ latest: v.string(), legacy: v.nullable(v.string()) }),
	species: NamedResourceSchema,
	moves: v.array(
		v.object({
			move: NamedResourceSchema,
			version_group_details: v.array(
				v.object({
					level_learned_at: v.number(),
					move_learn_method: NamedResourceSchema,
					version_group: NamedResourceSchema
				})
			)
		})
	)
});
