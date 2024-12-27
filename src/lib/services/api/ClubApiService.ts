import type { Club } from '$lib/database/IndexedDB';

export async function getApiClubs(): Promise<Club[]> {
	return fetch('/api/clubs').then((response) => response.json());
}
