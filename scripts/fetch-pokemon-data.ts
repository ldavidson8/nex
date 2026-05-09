// scripts/fetch-pokemon-data.ts
import fs from 'fs/promises';
import path from 'path';

interface PokeAPIListResponse {
	count: number;
	results: { name: string; url: string }[];
}

interface PokeAPIPokemon {
	id: number;
	name: string;
	types: { type: { name: string } }[];
	stats: { base_stat: number; stat: { name: string } }[];
	species: { url: string };
	sprites: {
		front_default: string | null;
		front_shiny: string | null;
	};
}

interface PokeAPISpecies {
	generation: { name: string };
	is_legendary: boolean;
	is_mythical: boolean;
	is_baby: boolean;
	varieties: { pokemon: { name: string } }[];
	names: { language: { name: string }; name: string }[];
}

const BATCH_SIZE = 50;
const API_BASE = 'https://pokeapi.co/api/v2';

async function fetchWithRetry(url: string, retries = 3): Promise<any> {
	for (let i = 0; i < retries; i++) {
		try {
			const response = await fetch(url);
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			return response.json();
		} catch (error) {
			if (i === retries - 1) throw error;
			await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
		}
	}
}

async function processBatch(urls: string[]): Promise<PokeAPIPokemon[]> {
	return Promise.all(urls.map((url) => fetchWithRetry(url)));
}

function detectRegionalForme(name: string): string | null {
	if (name.includes('-alola')) return 'alola';
	if (name.includes('-galar')) return 'galar';
	if (name.includes('-hisui')) return 'hisui';
	if (name.includes('-paldea')) return 'paldea';
	return null;
}

function hasMegaEvolution(varieties: { pokemon: { name: string } }[]): boolean {
	return varieties.some((v) => v.pokemon.name.includes('-mega'));
}

function hasGigantamax(varieties: { pokemon: { name: string } }[]): boolean {
	return varieties.some((v) => v.pokemon.name.includes('-gmax'));
}

function mapStats(stats: { base_stat: number; stat: { name: string } }[]) {
	const statMap: Record<string, number> = {};
	for (const s of stats) {
		statMap[s.stat.name] = s.base_stat;
	}

	return {
		hp: statMap['hp'] ?? 0,
		attack: statMap['attack'] ?? 0,
		defense: statMap['defense'] ?? 0,
		specialAttack: statMap['special-attack'] ?? 0,
		specialDefense: statMap['special-defense'] ?? 0,
		speed: statMap['speed'] ?? 0,
		total: Object.values(statMap).reduce((a, b) => a + b, 0)
	};
}

async function main() {
	console.log('Fetching Pokemon list...');

	// Get all Pokemon (currently ~1300+)
	const listResponse: PokeAPIListResponse = await fetchWithRetry(`${API_BASE}/pokemon?limit=2000`);

	console.log(`Found ${listResponse.count} Pokemon`);

	const allPokemon: any[] = [];
	const speciesCache = new Map<string, PokeAPISpecies>();

	// Process in batches
	for (let i = 0; i < listResponse.results.length; i += BATCH_SIZE) {
		const batch = listResponse.results.slice(i, i + BATCH_SIZE);
		console.log(
			`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(listResponse.results.length / BATCH_SIZE)}`
		);

		const pokemonDetails = await processBatch(batch.map((p) => p.url));

		for (const pokemon of pokemonDetails) {
			try {
				// Fetch species data (with caching for base species)
				const speciesUrl = pokemon.species.url;
				let species: PokeAPISpecies;

				if (speciesCache.has(speciesUrl)) {
					species = speciesCache.get(speciesUrl)!;
				} else {
					species = await fetchWithRetry(speciesUrl);
					speciesCache.set(speciesUrl, species);
				}

				const englishName =
					species.names.find((n) => n.language.name === 'en')?.name ?? pokemon.name;

				allPokemon.push({
					id: pokemon.id,
					name: pokemon.name,
					displayName: englishName,
					types: pokemon.types.map((t) => t.type.name),
					stats: mapStats(pokemon.stats),
					generation: species.generation.name,
					isLegendary: species.is_legendary,
					isMythical: species.is_mythical,
					isBaby: species.is_baby,
					regionalForme: detectRegionalForme(pokemon.name),
					hasMegaEvolution: hasMegaEvolution(species.varieties),
					hasGigantamax: hasGigantamax(species.varieties),
					sprites: {
						default: pokemon.sprites.front_default,
						shiny: pokemon.sprites.front_shiny
					}
				});
			} catch (error) {
				console.error(`Failed to process ${pokemon.name}:`, error);
			}
		}

		// Rate limiting
		await new Promise((r) => setTimeout(r, 500));
	}

	// Sort by ID
	allPokemon.sort((a, b) => a.id - b.id);

	// Write to static file
	const outputPath = path.join(process.cwd(), 'static', 'pokemon-data.json');
	await fs.writeFile(outputPath, JSON.stringify(allPokemon, null, 2));

	console.log(`Wrote ${allPokemon.length} Pokemon to ${outputPath}`);

	// Also create a minified version
	const minifiedPath = path.join(process.cwd(), 'static', 'pokemon-data.min.json');
	await fs.writeFile(minifiedPath, JSON.stringify(allPokemon));

	console.log('Done!');
}

main().catch(console.error);
