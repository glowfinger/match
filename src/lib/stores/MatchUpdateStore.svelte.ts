import type { UUID } from 'crypto';

export const matchUpdates = $state<
	{
		id: UUID;
		matchId: number;
		updatedAt: string;
		section: string;
	}[]
>([]);

export function addMatchUpdate(matchId: number, section: string) {
	matchUpdates.push({
		id: crypto.randomUUID(),
		matchId,
		updatedAt: new Date().toISOString(),
		section,
	});
}

export function getMatchUpdate(id: UUID) {
	return matchUpdates.find((update) => update.id === id);
}

export function getMatchUpdates() {
	return matchUpdates;
}

// export function removeMatchUpdate(id: UUID) {
// 	matchUpdates = matchUpdates.filter((update) => update.id !== id);
// }
