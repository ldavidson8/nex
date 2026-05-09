import Normal from '$lib/icons/normal.svg?component';
import Fire from '$lib/icons/fire.svg?component';
import Water from '$lib/icons/water.svg?component';
import Electric from '$lib/icons/electric.svg?component';
import Grass from '$lib/icons/grass.svg?component';
import Ice from '$lib/icons/ice.svg?component';
import Fighting from '$lib/icons/fighting.svg?component';
import Poison from '$lib/icons/poison.svg?component';
import Ground from '$lib/icons/ground.svg?component';
import Flying from '$lib/icons/flying.svg?component';
import Psychic from '$lib/icons/psychic.svg?component';
import Bug from '$lib/icons/bug.svg?component';
import Rock from '$lib/icons/rock.svg?component';
import Ghost from '$lib/icons/ghost.svg?component';
import Dragon from '$lib/icons/dragon.svg?component';
import Dark from '$lib/icons/dark.svg?component';
import Steel from '$lib/icons/steel.svg?component';
import Fairy from '$lib/icons/fairy.svg?component';

const typeIcons: Record<string, typeof Normal> = {
	normal: Normal,
	fire: Fire,
	water: Water,
	electric: Electric,
	grass: Grass,
	ice: Ice,
	fighting: Fighting,
	poison: Poison,
	ground: Ground,
	flying: Flying,
	psychic: Psychic,
	bug: Bug,
	rock: Rock,
	ghost: Ghost,
	dragon: Dragon,
	dark: Dark,
	steel: Steel,
	fairy: Fairy
};

export function getTypeIcon(type: string) {
	return typeIcons[type.toLowerCase()] || null;
}
