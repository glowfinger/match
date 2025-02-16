import type { MatchPosition } from '$lib/database/IndexedDB';

export function sortByMatchPostion(a: MatchPosition, b: MatchPosition) {
	if (!Object.hasOwn(a, 'position') && !Object.hasOwn(b, 'position')) {
		return 0;
	}

	if (!Object.hasOwn(a, 'position')) {
		return -1;
	}

	if (!Object.hasOwn(b, 'position')) {
		return 1;
	}

	const AP = parseInt(a.position);
	const BP = parseInt(b.position);

	if (AP < BP) {
		return -1;
	}

	if (AP > BP) {
		return 1;
	}

	return 0;
}
