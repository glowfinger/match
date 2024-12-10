import { db, type Position } from '$lib/IndexedDB';

export async function setPosition(playerKey: string, matchId: number, position: string) {
	const pos = {
		playerKey,
		matchId,
		position,
	};

	const existing = await db.positions.where({ playerKey, matchId }).first();

	if (existing) {
		await db.positions.update(existing.id, pos);
	} else {
		await db.positions.add(pos);
	}
}

export async function getPositions(matchId: number): Promise<Position[]> {
	return db.positions.where({ matchId }).toArray();
}
