import { db, type MatchImage } from '../IndexedDB';

export async function getImagesByMatch(matchId: number): Promise<MatchImage[]> {
	return db.matchImages.where({ matchId }).toArray();
}

export async function getImagesByMatchAndType(
	matchId: number,
	type: string,
): Promise<MatchImage[]> {
	return db.matchImages.where({ matchId, type }).toArray();
}

export async function setMatchImage(image: MatchImage | Omit<MatchImage, 'id'>): Promise<void> {
	const criteria = { matchId: image.matchId, type: image.type, page: image.page };

	const existing = await db.matchImages.where(criteria).first();
	if (existing) {
		await db.matchImages.update(existing.id, image);
	} else {
		await db.matchImages.add(image);
	}
}

export async function deleteMatchImage(matchId: number): Promise<void> {
	await db.matchImages.where({ matchId }).delete();
}

export async function deleteMatchImagesByType(matchId: number, type: string): Promise<void> {
	console.log('deleteMatchImagesByType', matchId, type);
	await db.matchImages.where({ matchId, type }).delete();
}
