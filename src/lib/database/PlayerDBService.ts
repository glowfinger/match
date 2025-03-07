import { db, type Player } from '$lib/database/IndexedDB';

export async function getPlayer(key: string): Promise<Player> {
	const player = await db.players.get(key);
	if (player) {
		return player;
	}
	throw new Error('Player not found');
}

export async function getPlayers(): Promise<Player[]> {
	return await db.players.toArray();
}

export async function getPlayersByKeys(keys: string[]): Promise<Player[]> {
	return await db.players.where('key').anyOf(keys).toArray();
}

export async function addPlayers(data: Player[]): Promise<Player[]> {
	await db.players.bulkAdd(data);
	return await getPlayers();
}

export async function clearPlayers() {
	return await db.players.clear();
}
