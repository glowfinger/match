import { db, type Match } from '$lib/IndexedDB';

export async function getMatches(): Promise<Match[]> {
	return await db.matches.toArray();
}

export async function addMatch(data: Match): Promise<Match> {
	const { matchOn, type, team, squad } = data;
	const id = await db.matches.add({ matchOn, type, team, squad });
	const match = await db.matches.get(id);
	if (match) {
		return match;
	}
	throw new Error('Match not found');
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
