import type { Match } from '$lib/database/IndexedDB';

export function getMatchTitle(match: Match): string {
	let title = 'Match';

	const listFirst = ['HOME', 'NEUTRAL'].includes(match.detail?.venue ?? '');

	if (!match.team || !match.opponent) {
		return title;
	}

	if (listFirst) {
		title = `${match.team?.squad} vs ${match.opponent?.club}`;
	} else {
		title = `${match.opponent?.club} vs ${match.team?.squad}`;
	}

	return title;
}
