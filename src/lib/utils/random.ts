/**
 * Picks a random element from the provided array.
 * @param {T[]} array - The array to pick a random element from.
 * @returns {T} A random element from the array.
 */
export function randomPick<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generates a random integer within the provided range (inclusive).
 * @param {number} min - The minimum possible value.
 * @param {number} max - The maximum possible value.
 * @returns {number} A random integer within the specified range.
 */
export function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
