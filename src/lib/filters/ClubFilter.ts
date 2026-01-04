import type { Club } from '$lib/database/IndexedDB';
import Fuse from 'fuse.js';

const SEARCH_KEYS = ['name', 'code'];
const SEARCH_THRESHOLD = 0.3;

export default function filterClubs(clubs: Club[], search: string): Club[] {
	if (search.length === 0) {
		return clubs;
	}

	const fuse = new Fuse(clubs, {
		useExtendedSearch: true,
		keys: SEARCH_KEYS,
		threshold: SEARCH_THRESHOLD,
	});
	const results = fuse.search(search);
	return results.map((result) => result.item);
}
