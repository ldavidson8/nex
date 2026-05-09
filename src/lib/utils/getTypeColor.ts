import { POKEMON_COLOURS } from '$lib/constants';

export function getTypeColor(type: string) {
	return POKEMON_COLOURS[type.toLowerCase() as keyof typeof POKEMON_COLOURS];
}
