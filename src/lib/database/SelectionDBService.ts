import { db, type Selection } from '$lib/database/IndexedDB';

export async function setSelection(playerKey: string, matchId: number, available: string) {
	const selection = {
		playerKey,
		matchId,
		available,
	};

	const existing = await db.selections.where({ playerKey, matchId }).first();

	if (existing) {
		await db.selections.update(existing.id, selection);
	} else {
		await db.selections.add(selection);
	}
}

export async function getSelections(matchId: number): Promise<Selection[]> {
	return await db.selections.where({ matchId }).toArray();
}

export async function getYesSelectionsByMatchId(matchId: number): Promise<Selection[]> {
	return await db.selections.where({ matchId, available: 'yes' }).toArray();
}
