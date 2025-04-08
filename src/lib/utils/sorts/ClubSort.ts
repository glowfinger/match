import type { Match } from '$lib/database/IndexedDB';

export function sortByDate(a: Match, b: Match) {
	if (!Object.hasOwn(a, 'schedule') && !Object.hasOwn(b, 'schedule')) {
		return 0;
	}

	if (!Object.hasOwn(a, 'schedule')) {
		return -1;
	}

	if (!Object.hasOwn(b, 'schedule')) {
		return 1;
	}

	if (!a.schedule?.matchOn && !b.schedule?.matchOn) {
		return 0;
	}

	if (a.schedule?.matchOn && b.schedule?.matchOn && a.schedule.matchOn < b.schedule.matchOn) {
		return 1;
	}

	if ((a.schedule?.matchOn ?? 0) > (b.schedule?.matchOn ?? 0)) {
		return -1;
	}

	if (a.createdAt < b.createdAt) {
		return -1;
	}
	if (a.createdAt > b.createdAt) {
		return 1;
	}

	return 0;
}
