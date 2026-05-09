import { getContext, setContext } from 'svelte';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import type { PokemonType } from '$lib/types';

const KEY = Symbol('POKEMON_FILTERS');

export type StatKey =
	| 'hp'
	| 'attack'
	| 'defense'
	| 'specialAttack'
	| 'specialDefense'
	| 'speed'
	| 'total';

export interface PokemonData {
	id: number;
	name: string;
	displayName: string;
	types: PokemonType[];
	stats: {
		hp: number;
		attack: number;
		defense: number;
		specialAttack: number;
		specialDefense: number;
		speed: number;
		total: number;
	};
	generation: string;
	isLegendary: boolean;
	isMythical: boolean;
	isBaby: boolean;
	regionalForme: string | null;
	hasMegaEvolution: boolean;
	hasGigantamax: boolean;
	sprites: {
		default: string;
		shiny: string;
	};
}

export class PokemonFilterState {
	// Text search
	#searchQuery = $state('');

	// Type filters (multi-select)
	#selectedTypes = $state<PokemonType[]>([]);

	// Generation filter
	#selectedGeneration = $state<string>('all');

	// Special classifications
	#showLegendary = $state<boolean | null>(null);
	#showMythical = $state<boolean | null>(null);
	#showBaby = $state<boolean | null>(null);
	#showRegional = $state<boolean | null>(null);
	#showMega = $state<boolean | null>(null);
	#showGigantamax = $state<boolean | null>(null);

	// Stats ranges (min/max)
	#statRanges = $state({
		hp: [0, 255] as [number, number],
		attack: [0, 255] as [number, number],
		defense: [0, 255] as [number, number],
		specialAttack: [0, 255] as [number, number],
		specialDefense: [0, 255] as [number, number],
		speed: [0, 255] as [number, number],
		total: [0, 800] as [number, number]
	});

	// Getters
	get searchQuery() {
		return this.#searchQuery;
	}
	set searchQuery(value: string) {
		this.#searchQuery = value;
	}

	get selectedTypes() {
		return this.#selectedTypes;
	}
	set selectedTypes(value: PokemonType[]) {
		this.#selectedTypes = value;
	}

	get selectedGeneration() {
		return this.#selectedGeneration;
	}
	set selectedGeneration(value: string) {
		this.#selectedGeneration = value;
	}

	get showLegendary() {
		return this.#showLegendary;
	}
	set showLegendary(value: boolean | null) {
		this.#showLegendary = value;
	}

	get showMythical() {
		return this.#showMythical;
	}
	set showMythical(value: boolean | null) {
		this.#showMythical = value;
	}

	get showBaby() {
		return this.#showBaby;
	}
	set showBaby(value: boolean | null) {
		this.#showBaby = value;
	}

	get showRegional() {
		return this.#showRegional;
	}
	set showRegional(value: boolean | null) {
		this.#showRegional = value;
	}

	get showMega() {
		return this.#showMega;
	}
	set showMega(value: boolean | null) {
		this.#showMega = value;
	}

	get showGigantamax() {
		return this.#showGigantamax;
	}
	set showGigantamax(value: boolean | null) {
		this.#showGigantamax = value;
	}

	get statRanges() {
		return this.#statRanges;
	}
	setStatRange(stat: StatKey, range: [number, number]) {
		this.#statRanges = { ...this.#statRanges, [stat]: range };
	}

	// Computed: Check if any filters are active
	get hasActiveFilters() {
		return (
			this.#searchQuery !== '' ||
			this.#selectedTypes.length > 0 ||
			this.#selectedGeneration !== 'all' ||
			this.#showLegendary !== null ||
			this.#showMythical !== null ||
			this.#showBaby !== null ||
			this.#showRegional !== null ||
			this.#showMega !== null ||
			this.#showGigantamax !== null ||
			this.#statRanges.hp[0] > 0 ||
			this.#statRanges.hp[1] < 255 ||
			this.#statRanges.attack[0] > 0 ||
			this.#statRanges.attack[1] < 255 ||
			this.#statRanges.defense[0] > 0 ||
			this.#statRanges.defense[1] < 255 ||
			this.#statRanges.specialAttack[0] > 0 ||
			this.#statRanges.specialAttack[1] < 255 ||
			this.#statRanges.specialDefense[0] > 0 ||
			this.#statRanges.specialDefense[1] < 255 ||
			this.#statRanges.speed[0] > 0 ||
			this.#statRanges.speed[1] < 255 ||
			this.#statRanges.total[0] > 0 ||
			this.#statRanges.total[1] < 800
		);
	}

	constructor() {
		this.#initFromUrl();

		// Sync to URL when filters change
		$effect(() => {
			const params = new URLSearchParams();

			if (this.#searchQuery) params.set('q', this.#searchQuery);
			if (this.#selectedTypes.length > 0) params.set('types', this.#selectedTypes.join(','));
			if (this.#selectedGeneration !== 'all') params.set('gen', this.#selectedGeneration);
			if (this.#showLegendary !== null) params.set('legendary', String(this.#showLegendary));
			if (this.#showMythical !== null) params.set('mythical', String(this.#showMythical));
			if (this.#showBaby !== null) params.set('baby', String(this.#showBaby));
			if (this.#showRegional !== null) params.set('regional', String(this.#showRegional));
			if (this.#showMega !== null) params.set('mega', String(this.#showMega));
			if (this.#showGigantamax !== null) params.set('gigantamax', String(this.#showGigantamax));

			// Stats - sync all stat ranges
			if (this.#statRanges.hp[0] > 0) params.set('hpMin', String(this.#statRanges.hp[0]));
			if (this.#statRanges.hp[1] < 255) params.set('hpMax', String(this.#statRanges.hp[1]));
			if (this.#statRanges.attack[0] > 0) params.set('atkMin', String(this.#statRanges.attack[0]));
			if (this.#statRanges.attack[1] < 255)
				params.set('atkMax', String(this.#statRanges.attack[1]));
			if (this.#statRanges.defense[0] > 0)
				params.set('defMin', String(this.#statRanges.defense[0]));
			if (this.#statRanges.defense[1] < 255)
				params.set('defMax', String(this.#statRanges.defense[1]));
			if (this.#statRanges.specialAttack[0] > 0)
				params.set('spAtkMin', String(this.#statRanges.specialAttack[0]));
			if (this.#statRanges.specialAttack[1] < 255)
				params.set('spAtkMax', String(this.#statRanges.specialAttack[1]));
			if (this.#statRanges.specialDefense[0] > 0)
				params.set('spDefMin', String(this.#statRanges.specialDefense[0]));
			if (this.#statRanges.specialDefense[1] < 255)
				params.set('spDefMax', String(this.#statRanges.specialDefense[1]));
			if (this.#statRanges.speed[0] > 0) params.set('spdMin', String(this.#statRanges.speed[0]));
			if (this.#statRanges.speed[1] < 255) params.set('spdMax', String(this.#statRanges.speed[1]));
			if (this.#statRanges.total[0] > 0) params.set('totalMin', String(this.#statRanges.total[0]));
			if (this.#statRanges.total[1] < 800)
				params.set('totalMax', String(this.#statRanges.total[1]));

			const queryString = params.toString();
			goto(queryString ? `?${queryString}` : '?', {
				keepFocus: true,
				replaceState: true,
				noScroll: true
			});
		});
	}

	#initFromUrl() {
		if (!browser) return;

		const params = new URLSearchParams(window.location.search);

		this.#searchQuery = params.get('q') || '';

		const typesParam = params.get('types');
		if (typesParam) {
			this.#selectedTypes = typesParam.split(',') as PokemonType[];
		}

		this.#selectedGeneration = params.get('gen') || 'all';

		const legendaryParam = params.get('legendary');
		if (legendaryParam !== null) this.#showLegendary = legendaryParam === 'true';

		const mythicalParam = params.get('mythical');
		if (mythicalParam !== null) this.#showMythical = mythicalParam === 'true';

		const babyParam = params.get('baby');
		if (babyParam !== null) this.#showBaby = babyParam === 'true';

		const regionalParam = params.get('regional');
		if (regionalParam !== null) this.#showRegional = regionalParam === 'true';

		const megaParam = params.get('mega');
		if (megaParam !== null) this.#showMega = megaParam === 'true';

		const gigantamaxParam = params.get('gigantamax');
		if (gigantamaxParam !== null) this.#showGigantamax = gigantamaxParam === 'true';

		// Stats ranges
		const hpMin = params.get('hpMin');
		const hpMax = params.get('hpMax');
		if (hpMin !== null) this.#statRanges.hp[0] = parseInt(hpMin, 10);
		if (hpMax !== null) this.#statRanges.hp[1] = parseInt(hpMax, 10);

		const atkMin = params.get('atkMin');
		const atkMax = params.get('atkMax');
		if (atkMin !== null) this.#statRanges.attack[0] = parseInt(atkMin, 10);
		if (atkMax !== null) this.#statRanges.attack[1] = parseInt(atkMax, 10);

		const defMin = params.get('defMin');
		const defMax = params.get('defMax');
		if (defMin !== null) this.#statRanges.defense[0] = parseInt(defMin, 10);
		if (defMax !== null) this.#statRanges.defense[1] = parseInt(defMax, 10);

		const spAtkMin = params.get('spAtkMin');
		const spAtkMax = params.get('spAtkMax');
		if (spAtkMin !== null) this.#statRanges.specialAttack[0] = parseInt(spAtkMin, 10);
		if (spAtkMax !== null) this.#statRanges.specialAttack[1] = parseInt(spAtkMax, 10);

		const spDefMin = params.get('spDefMin');
		const spDefMax = params.get('spDefMax');
		if (spDefMin !== null) this.#statRanges.specialDefense[0] = parseInt(spDefMin, 10);
		if (spDefMax !== null) this.#statRanges.specialDefense[1] = parseInt(spDefMax, 10);

		const spdMin = params.get('spdMin');
		const spdMax = params.get('spdMax');
		if (spdMin !== null) this.#statRanges.speed[0] = parseInt(spdMin, 10);
		if (spdMax !== null) this.#statRanges.speed[1] = parseInt(spdMax, 10);

		const totalMin = params.get('totalMin');
		const totalMax = params.get('totalMax');
		if (totalMin !== null) this.#statRanges.total[0] = parseInt(totalMin, 10);
		if (totalMax !== null) this.#statRanges.total[1] = parseInt(totalMax, 10);
	}

	reset() {
		this.#searchQuery = '';
		this.#selectedTypes = [];
		this.#selectedGeneration = 'all';
		this.#showLegendary = null;
		this.#showMythical = null;
		this.#showBaby = null;
		this.#showRegional = null;
		this.#showMega = null;
		this.#showGigantamax = null;
		this.#statRanges = {
			hp: [0, 255],
			attack: [0, 255],
			defense: [0, 255],
			specialAttack: [0, 255],
			specialDefense: [0, 255],
			speed: [0, 255],
			total: [0, 800]
		};
	}

	filterPokemon(pokemonList: PokemonData[]): PokemonData[] {
		return pokemonList.filter((pokemon) => {
			// Search query
			if (this.#searchQuery) {
				const query = this.#searchQuery.toLowerCase();
				const matchesName = pokemon.name.toLowerCase().includes(query);
				const matchesDisplayName = pokemon.displayName.toLowerCase().includes(query);
				const matchesId = pokemon.id.toString() === query;
				if (!matchesName && !matchesDisplayName && !matchesId) return false;
			}

			// Type filter
			if (this.#selectedTypes.length > 0) {
				const hasAllTypes = this.#selectedTypes.every((type) => pokemon.types.includes(type));
				if (!hasAllTypes) return false;
			}

			// Generation filter
			if (this.#selectedGeneration !== 'all') {
				if (pokemon.generation !== this.#selectedGeneration) return false;
			}

			// Special classifications
			if (this.#showLegendary !== null) {
				if (pokemon.isLegendary !== this.#showLegendary) return false;
			}
			if (this.#showMythical !== null) {
				if (pokemon.isMythical !== this.#showMythical) return false;
			}
			if (this.#showBaby !== null) {
				if (pokemon.isBaby !== this.#showBaby) return false;
			}
			if (this.#showRegional !== null) {
				if ((pokemon.regionalForme !== null) !== this.#showRegional) return false;
			}
			if (this.#showMega !== null) {
				if (pokemon.hasMegaEvolution !== this.#showMega) return false;
			}
			if (this.#showGigantamax !== null) {
				if (pokemon.hasGigantamax !== this.#showGigantamax) return false;
			}

			// Stats ranges
			if (pokemon.stats.hp < this.#statRanges.hp[0] || pokemon.stats.hp > this.#statRanges.hp[1])
				return false;
			if (
				pokemon.stats.attack < this.#statRanges.attack[0] ||
				pokemon.stats.attack > this.#statRanges.attack[1]
			)
				return false;
			if (
				pokemon.stats.defense < this.#statRanges.defense[0] ||
				pokemon.stats.defense > this.#statRanges.defense[1]
			)
				return false;
			if (
				pokemon.stats.specialAttack < this.#statRanges.specialAttack[0] ||
				pokemon.stats.specialAttack > this.#statRanges.specialAttack[1]
			)
				return false;
			if (
				pokemon.stats.specialDefense < this.#statRanges.specialDefense[0] ||
				pokemon.stats.specialDefense > this.#statRanges.specialDefense[1]
			)
				return false;
			if (
				pokemon.stats.speed < this.#statRanges.speed[0] ||
				pokemon.stats.speed > this.#statRanges.speed[1]
			)
				return false;
			if (
				pokemon.stats.total < this.#statRanges.total[0] ||
				pokemon.stats.total > this.#statRanges.total[1]
			)
				return false;

			return true;
		});
	}

	static init() {
		return setContext(KEY, new PokemonFilterState());
	}

	static get() {
		return getContext<PokemonFilterState>(KEY);
	}
}
