import { typeChart } from '$lib/config/type-chart';
import type { PokemonType } from '$lib/types';

export function getEffectiveness(attacker: PokemonType, defender: PokemonType) {
	return typeChart[attacker][defender] ?? 1;
}
