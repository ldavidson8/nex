export function extractIdFromUrl(url: string): number {
	const id = url.split('/').filter(Boolean).pop();
	return id ? parseInt(id) : 0;
}
