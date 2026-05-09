import PokeballIcon from '$lib/icons/pokeball.svg?component';
import LucideMap from '~icons/lucide/map';
import LucideSword from '~icons/lucide/sword';
import LucideSparkles from '~icons/lucide/sparkles';
import LucideDna from '~icons/lucide/dna';
import LucideBackpack from '~icons/lucide/backpack';
import LucideCalculator from '~icons/lucide/calculator';
import type { Component } from 'svelte';

export interface NavItem {
	title: string;
	desc: string;
	href: string;
}

export interface FeatureItem {
	title: string;
	desc: string;
	href: string;
	image: string;
}

export interface NavCategory {
	label: string;
	id: string;
	icon?: Component;
	columns: {
		left: NavItem[];
		right: NavItem[];
	};
	feature: FeatureItem;
}

export const navData: NavCategory[] = [
	{
		label: 'Pokédex',
		id: 'pokedex',
		icon: PokeballIcon,
		columns: {
			left: [
				{ title: 'National Dex', desc: 'All 1025 Pokémon', href: '/pokemon' },
				{ title: 'By Generation', desc: 'Browse each generation', href: '/pokemon/generations' },
				{ title: 'By Type', desc: 'Filter by type matchups', href: '/pokemon/by-type' },
				{ title: 'Legendary & Mythical', desc: 'Rare Pokémon', href: '/pokemon/legendary' }
			],
			right: [
				{ title: 'Mega Evolutions', desc: 'Temporary power boosts', href: '/pokemon/mega' },
				{ title: 'Regional Forms', desc: 'Alolan, Galarian, etc.', href: '/pokemon/forms' },
				{ title: 'Shiny Pokémon', desc: 'Alternate colorations', href: '/pokemon/shiny' },
				{ title: 'Evolution Chains', desc: 'Evolution families', href: '/pokemon/evolutions' }
			]
		},
		feature: {
			title: 'Compare Pokémon',
			desc: 'Side-by-side stat comparison and matchup analysis.',
			href: '/tools/compare',
			image: 'https://picsum.photos/600'
		}
	},
	{
		label: 'Moves',
		id: 'moves',
		icon: LucideSword,
		columns: {
			left: [
				{ title: 'Move Dex', desc: 'Complete move database', href: '/moves' },
				{
					title: 'Physical Moves',
					desc: 'Contact-based attacks',
					href: '/moves?category=physical'
				},
				{ title: 'Special Moves', desc: 'Ranged attacks', href: '/moves?category=special' },
				{ title: 'Status Moves', desc: 'Non-damaging effects', href: '/moves?category=status' }
			],
			right: [
				{ title: 'By Type', desc: 'Moves sorted by type', href: '/moves/by-type' },
				{ title: 'TMs & HMs', desc: 'Teachable moves', href: '/moves/machines' },
				{ title: 'Egg Moves', desc: 'Breeding-exclusive moves', href: '/moves/egg' },
				{ title: 'Z-Moves & Max', desc: 'Special battle moves', href: '/moves/special' }
			]
		},
		feature: {
			title: 'Move Coverage Tool',
			desc: 'Build the optimal moveset for any Pokémon.',
			href: '/tools/coverage',
			image: 'https://picsum.photos/600'
		}
	},
	{
		label: 'Abilities',
		id: 'abilities',
		icon: LucideSparkles,
		columns: {
			left: [
				{ title: 'Ability Dex', desc: 'All abilities listed', href: '/abilities' },
				{ title: 'Hidden Abilities', desc: 'Special abilities', href: '/abilities?filter=hidden' },
				{ title: 'Battle Abilities', desc: 'Combat-focused', href: '/abilities?filter=battle' }
			],
			right: [
				{ title: 'Weather Abilities', desc: 'Climate changers', href: '/abilities?filter=weather' },
				{ title: 'Terrain Abilities', desc: 'Field effects', href: '/abilities?filter=terrain' },
				{ title: 'Immunity Abilities', desc: 'Type immunities', href: '/abilities?filter=immunity' }
			]
		},
		feature: {
			title: 'Ability Guide',
			desc: 'Learn how abilities affect competitive play.',
			href: '/guides/abilities',
			image: 'https://picsum.photos/600'
		}
	},
	{
		label: 'Items',
		id: 'items',
		icon: LucideBackpack,
		columns: {
			left: [
				{ title: 'Item Dex', desc: 'Complete item database', href: '/items' },
				{ title: 'Held Items', desc: 'Battle equipment', href: '/items/held' },
				{ title: 'Poké Balls', desc: 'Capture devices', href: '/items/balls' },
				{ title: 'Berries', desc: 'Consumable items', href: '/items/berries' }
			],
			right: [
				{ title: 'Evolution Items', desc: 'Stones & triggers', href: '/items/evolution' },
				{ title: 'Key Items', desc: 'Story progression', href: '/items/key' },
				{ title: 'Medicine', desc: 'Healing items', href: '/items/medicine' },
				{ title: 'Battle Items', desc: 'Competitive staples', href: '/items/battle' }
			]
		},
		feature: {
			title: 'Item Locations',
			desc: 'Find where to obtain any item in each game.',
			href: '/items/locations',
			image: 'https://picsum.photos/600'
		}
	},
	{
		label: 'Types',
		id: 'types',
		icon: LucideDna,
		columns: {
			left: [
				{ title: 'Type Chart', desc: 'Full matchup table', href: '/types' },
				{ title: 'Fire', desc: 'Strong vs Grass, Bug', href: '/types/fire' },
				{ title: 'Water', desc: 'Strong vs Fire, Ground', href: '/types/water' },
				{ title: 'Electric', desc: 'Strong vs Water, Flying', href: '/types/electric' }
			],
			right: [
				{ title: 'Dragon', desc: 'Strong vs Dragon', href: '/types/dragon' },
				{ title: 'Fairy', desc: 'Strong vs Dragon, Dark', href: '/types/fairy' },
				{ title: 'Steel', desc: 'Resistant to many', href: '/types/steel' },
				{ title: 'All 18 Types', desc: 'Complete type list', href: '/types/all' }
			]
		},
		feature: {
			title: 'Type Calculator',
			desc: 'Calculate type matchups and team weaknesses.',
			href: '/tools/type-calc',
			image: 'https://picsum.photos/600'
		}
	},
	{
		label: 'Regions',
		id: 'regions',
		icon: LucideMap,
		columns: {
			left: [
				{ title: 'Kanto', desc: 'Gen 1 • Origins', href: '/regions/kanto' },
				{ title: 'Johto', desc: 'Gen 2 • Traditional', href: '/regions/johto' },
				{ title: 'Hoenn', desc: 'Gen 3 • Nature', href: '/regions/hoenn' },
				{ title: 'Sinnoh', desc: 'Gen 4 • Mythology', href: '/regions/sinnoh' },
				{ title: 'Unova', desc: 'Gen 5 • Modern', href: '/regions/unova' }
			],
			right: [
				{ title: 'Kalos', desc: 'Gen 6 • European', href: '/regions/kalos' },
				{ title: 'Alola', desc: 'Gen 7 • Tropical', href: '/regions/alola' },
				{ title: 'Galar', desc: 'Gen 8 • Industrial', href: '/regions/galar' },
				{ title: 'Paldea', desc: 'Gen 9 • Open world', href: '/regions/paldea' }
			]
		},
		feature: {
			title: 'Interactive Map',
			desc: 'Explore all regions with detailed location data.',
			href: '/regions/map',
			image: 'https://picsum.photos/600'
		}
	},
	{
		label: 'Tools',
		id: 'tools',
		icon: LucideCalculator,
		columns: {
			left: [
				{ title: 'Team Builder', desc: 'Build & analyze teams', href: '/tools/team-builder' },
				{ title: 'Damage Calculator', desc: 'Calculate battle damage', href: '/tools/damage-calc' },
				{ title: 'IV Calculator', desc: 'Determine hidden stats', href: '/tools/iv-calc' },
				{ title: 'EV Planner', desc: 'Plan stat training', href: '/tools/ev-planner' }
			],
			right: [
				{ title: 'Breeding Helper', desc: 'Optimize egg moves', href: '/tools/breeding' },
				{ title: 'Weakness Checker', desc: 'Team vulnerability', href: '/tools/weakness' },
				{ title: 'Shiny Calculator', desc: 'Shiny odds helper', href: '/tools/shiny-calc' },
				{ title: 'Speed Tier List', desc: 'Compare Pokémon speed', href: '/tools/speed-tiers' }
			]
		},
		feature: {
			title: 'Competitive Guide',
			desc: 'Master competitive battling with tier lists and strategies.',
			href: '/guides/competitive',
			image: 'https://picsum.photos/600'
		}
	}
];
