import { db, type Match, type MatchDetail, type MatchSchedule } from '$lib/database/IndexedDB';

export async function getMatches(): Promise<Match[]> {
	return await db.matches.toArray();
}

export async function addMatch(createdAt: string, userAgent: string): Promise<Match> {
	const id = await db.matches.add({ userAgent, createdAt });
	const match = await db.matches.get(id);
	if (match) {
		return match;
	}
	throw new Error('Match not found');
}

export async function updateMatch(id: number, data: Match) {
	await db.matches.update(id, { schedule: { ...data.schedule } });
	return await db.matches.get(id);
}

export async function updateMatchSchedule(id: number, schedule: MatchSchedule) {
	await db.matches.update(id, { schedule });
	return await db.matches.get(id);
}

export async function updateMatchDetail(id: number, detail: MatchDetail) {
	await db.matches.update(id, { detail });
	return await db.matches.get(id);
}

export async function deleteMatch(id: number) {
	return await db.matches.delete(id);
}

export async function updateMatchOn(id: number, matchOn: string) {
	await db.matches.update(id, { matchOn });
	return await db.matches.get(id);
}
export async function getMatch(id: number): Promise<Match> {
	const match = await db.matches.get(id);
	if (match) {
		return match;
	}
	throw new Error('Match not found');
}

export async function isMatch(match: Match) {
	const { matchOn, type, team, squad } = match;
	const result = (await db.matches.where({ matchOn, type, team, squad }).count()) > 0;
	return result;
}
