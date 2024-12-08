export async function getApiPlayers(): Promise<any> {
	return fetch('/api/players').then((response) => response.json());
}
