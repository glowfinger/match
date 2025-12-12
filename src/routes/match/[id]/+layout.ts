import { getMatch } from '$lib/database/MatchService';
import { getMatchTitle } from '$lib/utils/extractors/MatchExtractor';
import { error } from '@sveltejs/kit';

export const ssr = false;

export const load = async ({ params, url, route }) => {
	console.log(route.id, params);
	if (!params.id) {
		error(404, 'No match ID provided');
	}

	const matchId = Number.parseInt(params.id);
	if (isNaN(matchId)) {
		error(404, 'Invalid match ID');
	}

	const match = await getMatch(matchId);
	if (!match) {
		error(404, 'Match not found with ID: ' + matchId);
	}

	return {
		matchId,
		match: match,
		matchTile: getMatchTitle(match),
		params: params,
		pathKey: url.href,
	};
};
