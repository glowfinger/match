import { db, type MatchTag } from '$lib/database/IndexedDB';

export async function getMatchTags(matchId: number, type: string): Promise<MatchTag[]> {
	return db.matchTags.where({ matchId, type }).toArray();
}

export async function setMatchTag(matchId: number, playerKey: string, type: string): Promise<void> {
	const tag = {
		playerKey,
		matchId,
		type,
	};

	const existing = await db.matchTags.where({ matchId, playerKey, type }).first();

	if (existing) {
		db.matchTags.delete(existing.id);
	} else {
		db.matchTags.add(tag);
	}
}
