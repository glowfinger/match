import {
	db,
	type Match,
	type MatchDetail,
	type MatchOpponent,
	type MatchResult,
	type MatchSchedule,
	type MatchTeam,
} from '$lib/database/IndexedDB';

export async function getMatches(): Promise<Match[]> {
	return await db.matches.toArray();
}

export async function addMatch(createdAt: string, userAgent: string): Promise<Match> {
	const updatedAt = new Date().toISOString();
	const id = await db.matches.add({ userAgent, createdAt, updatedAt });
	const match = await db.matches.get(id);
	if (match) {
		return match;
	}
	throw new Error('Match not found');
}

export async function updateMatchSchedule(id: number, schedule: MatchSchedule) {
	const updatedAt = new Date().toISOString();
	await db.matches.update(id, { schedule, updatedAt });
	return await db.matches.get(id);
}

export async function updateOpponent(id: number, opponent: MatchOpponent) {
	const updatedAt = new Date().toISOString();
	await db.matches.update(id, { opponent, updatedAt });
	return await db.matches.get(id);
}

export async function updateMatchDetail(id: number, detail: MatchDetail) {
	const updatedAt = new Date().toISOString();
	await db.matches.update(id, { detail, updatedAt });
	return await db.matches.get(id);
}

export async function updateMatchTeam(id: number, team: MatchTeam) {
	const updatedAt = new Date().toISOString();
	await db.matches.update(id, { team, updatedAt });
	return await db.matches.get(id);
}

export async function deleteMatch(id: number) {
	return await db.matches.delete(id);
}

export async function getMatch(id: number): Promise<Match> {
	const match = await db.matches.get(id);
	if (match) {
		return match;
	}
	throw new Error('Match not found');
}

export async function updateMatchResult(id: number, result: MatchResult) {
	const updatedAt = new Date().toISOString();
	await db.matches.update(id, { result, updatedAt });
	return await db.matches.get(id);
}
