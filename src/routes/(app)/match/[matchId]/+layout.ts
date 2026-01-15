import { getMatch } from '$lib/database/MatchService';
import { getMatchTitle } from '$lib/utils/extractors/MatchExtractor';
import { error } from '@sveltejs/kit';

export const ssr = false;

export const load = async ({ params, url }) => {
	if (!params.matchId) {
		error(404, 'No match ID provided: ' + params.matchId);
	}

	const matchId = Number.parseInt(params.matchId);
	if (isNaN(matchId)) {
		error(404, 'Invalid match ID');
	}

	const match = await getMatch(matchId);
	if (!match) {
		error(404, 'Match not found with ID: ' + matchId);
	}

	const props = {
		matchId,
		matchTile: getMatchTitle(match),
		match,
		pathKey: url.href,
	};

	return props;
};
