import { PokeAPI } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent, fetch }) => {
	const { queryClient } = await parent();

	const name = params.name;

	await queryClient.prefetchQuery({
		queryKey: ['pokemon', name],
		queryFn: () => {
			const api = new PokeAPI(fetch);
			return api.getPokemonById(name);
		}
	});

	return { name };
};
