import type { Player } from '$lib/database/IndexedDB';

export async function getApiPlayers(): Promise<Player[]> {
	return fetch('/api/players').then((response) => response.json());
}
