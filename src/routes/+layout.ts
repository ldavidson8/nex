import { browser } from '$app/environment';
import { QueryClient } from '@tanstack/svelte-query';
import type { LayoutLoad } from './$types';

export const prerender = true;
export const trailingSlash = 'always';

// Singleton QueryClient instance for browser
let browserQueryClient: QueryClient | undefined;

function createQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1000 * 60 * 60,
				gcTime: 1000 * 60 * 60 * 24,
				retry: false,
				enabled: browser,
				networkMode: 'offlineFirst',
				refetchOnWindowFocus: false
			}
		}
	});
}

export const load: LayoutLoad = async () => {
	// Use singleton on browser, create new instance on server
	const queryClient = browser ? (browserQueryClient ??= createQueryClient()) : createQueryClient();

	return { queryClient };
};
