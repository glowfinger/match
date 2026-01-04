import { SHIRT_NUMBERS } from '$lib/counts/PlayerCounts';
import type { MatchPosition } from '$lib/database/IndexedDB';

export function isPosition(position: string): boolean {
	return SHIRT_NUMBERS.has(position);
}

export function alreadyStarting(
	matchPositions: MatchPosition[],
	matchId: number,
	playerKey: string,
): boolean {
	return matchPositions.some(
		(matchPosition) =>
			matchPosition.matchId === matchId &&
			matchPosition.playerKey === playerKey &&
			matchPosition.type === 'start',
	);
}

export function isStarting(
	matchPositions: MatchPosition[],
	matchId: number,
	playerKey: string,
): boolean {
	return matchPositions.some(
		(matchPosition) =>
			matchPosition.matchId === matchId &&
			matchPosition.playerKey === playerKey &&
			matchPosition.type === 'start',
	);
}
