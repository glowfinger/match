import { type MatchRole, db } from './IndexedDB';

export async function getMatchRoles(matchId: number): Promise<MatchRole[]> {
	return db.matchRoles.where({ matchId }).toArray();
}

export async function getMatchRolesByType(matchId: number, type: string): Promise<MatchRole[]> {
	return db.matchRoles.where({ matchId, type }).toArray();
}

export async function setMatchRole(
	playerKey: string,
	matchId: number,
	type: string,
	role: string,
): Promise<void> {
	const existing = await db.matchRoles.where({ matchId, role, type }).first();

	if (existing) {
		await db.matchRoles.update(existing.id, { playerKey, matchId, type, role });
	} else {
		await db.matchRoles.add({ playerKey, matchId, type, role });
	}
}

export async function unSetMatchRole(matchId: number, role: string, type: string): Promise<void> {
	await db.matchRoles.where({ matchId, role, type }).delete();
}
