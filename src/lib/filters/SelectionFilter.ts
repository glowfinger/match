import type { Selection } from '$lib/IndexedDB';

export function isAvailable(selction: Selection): boolean {
	return selction.available === 'yes' || selction.available === 'maybe';
}
