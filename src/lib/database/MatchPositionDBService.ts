import { db, type MatchPosition } from '$lib/database/IndexedDB';

export async function setPosition(
	playerKey: string,
	matchId: number,
	position: string,
	type: 'start' | 'replacement' | 'possible',
): Promise<void> {
	const pos = {
		playerKey,
		matchId,
		position,
		type,
	};

	const existing = await db.matchPositions.where({ playerKey, matchId, position, type }).first();

	if (existing) {
		await db.matchPositions.update(existing.id, pos);
	} else {
		await db.matchPositions.add(pos);
	}
}

// TODO: Remove this function
export async function getPositions(matchId: number): Promise<MatchPosition[]> {
	return db.matchPositions.where({ matchId }).toArray();
}

export async function getMatchPositions(matchId: number): Promise<MatchPosition[]> {
	return db.matchPositions.where({ matchId }).toArray();
}

export async function deleteMatchPositions(
	matchId: number,
	position: string,
	type: 'start' | 'replacement',
): Promise<void> {
	await db.matchPositions.where({ matchId, position, type }).delete();
}

export async function deleteMatchPlayer(
	matchId: number,
	playerKey: string,
	type: 'start' | 'replacement',
): Promise<void> {
	await db.matchPositions.where({ matchId, playerKey, type }).delete();
}

export async function deleteMatchAllositions(matchId: number, playerKey: string): Promise<void> {
	await db.matchPositions.where({ matchId, playerKey }).delete();
}
