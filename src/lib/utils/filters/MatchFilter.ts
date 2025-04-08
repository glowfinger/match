import type { Match } from '$lib/database/IndexedDB';

export function findFirstOfEachType(matches: Match[]) {
	const firstOfEachType = new Map<string, Match>();

	for (const match of matches) {
		if (!firstOfEachType.has(match.type)) {
			firstOfEachType.set(match.type, match);
		}
	}

	return Array.from(firstOfEachType.values());
}
