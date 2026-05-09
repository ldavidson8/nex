export function formatId(id: string | number) {
	const idStr = id.toString().trim();
	if (idStr.length >= 4) {
		return idStr;
	}
	return idStr.padStart(3, '0');
}
