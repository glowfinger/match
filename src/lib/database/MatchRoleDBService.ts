import { type MatchRole, db } from './IndexedDB';

export async function getMatchRoles(matchId: number): Promise<MatchRole[]> {
	return db.matchRoles.where({ matchId }).toArray();
}

export async function setRole(playerKey: string, matchId: number, role: string): Promise<void> {
	const existing = await db.matchRoles.where({ playerKey, matchId, role }).first();

	if (existing) {
		await db.matchRoles.update(existing.id, { playerKey, matchId, role });
	} else {
		await db.matchRoles.add({ playerKey, matchId, role });
	}
}

export async function unSetMatchRole(matchId: number, role: string): Promise<void> {
	await db.matchRoles.where({ matchId, role }).delete();
}
