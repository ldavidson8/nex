export function formatPokemonName(slug: string) {
	if (!slug) return '';

	let parts = slug.split('-');

	const prefixes = ['mega', 'gmax', 'alola', 'galar', 'hisui', 'origin', 'primal', 'altered'];

	for (const prefix of prefixes) {
		const index = parts.indexOf(prefix);
		if (index > 0) {
			const [removed] = parts.splice(index, 1);
			parts.unshift(removed);
		}

		return parts
			.map((part) => {
				// Handle special cases like 'x' or 'y' (Mega Charizard Y)
				if (part.length === 1) return part.toUpperCase();

				// Handle 'gmax' -> 'G-Max' (optional, stylistic choice)
				if (part === 'gmax') return 'Gigantamax';

				// Standard Capitalization
				return part.charAt(0).toUpperCase() + part.slice(1);
			})
			.join(' ');
	}
}
