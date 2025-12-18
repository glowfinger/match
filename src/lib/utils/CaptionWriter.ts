import type { Match } from '$lib/database/IndexedDB';
import { getMatchRolesByType } from '$lib/database/MatchRoleDBService';
import { getPlayer } from '$lib/database/PlayerDBService';
import { convertTime, matchDate } from '$lib/helpers/dateTime/ConvertTime';

export async function getCaption(mediaType: string, match: Match): Promise<string> {
	if (mediaType === 'MATCH') {
		return writeMatchCaption(match);
	}

	if (mediaType === 'RESULT') {
		return await writeResultCaption(match);
	}

	return '';
}

function writeMatchCaption(match: Match): string {
	const lines: string[] = [];

	lines.push(getMatchTeams(match));
	lines.push(getMatchType(match));
	lines.push('');
	lines.push(getMatchDetails(match));
	lines.push('');
	lines.push(getMatchTags());
	lines.push('');
	lines.push(getSponsors());
	return lines.join('\n');
}

async function writeResultCaption(match: Match): Promise<string> {
	const lines: string[] = [];
	lines.push(getMatchTeamsWithResult(match));
	lines.push('');

	lines.push(await getMatchAwards(match.id));
	lines.push('');
	lines.push(getResultTags());
	lines.push('');
	lines.push(getSponsors());

	console.log(lines.join('\n'));

	return lines.join('\n');
}

function getMatchResultTitle(match: Match): string {
	if (!match.result) {
		return '';
	}

	if (match.result.homeScore > match.result.awayScore) {
		return 'Win';
	}

	if (match.result.homeScore < match.result.awayScore) {
		return 'Loss';
	}

	return `${match.result?.homeScore ?? 0} - ${match.result?.awayScore ?? 0}`;
}

async function getMatchAwards(matchId: number): Promise<string> {
	const awards = await getMatchRolesByType(matchId, 'awards');

	const forwardsMOTM = awards.find((award) => award.role === 'forwards-motm')?.playerKey;
	const backsMOTM = awards.find((award) => award.role === 'backs-motm')?.playerKey;
	const jointMOTM = awards.find((award) => award.role === 'motm')?.playerKey;

	if (jointMOTM) {
		const player = await getPlayer(jointMOTM);

		const instagram = player?.social.instagram
			? `@${player.social.instagram.toLowerCase().replace('@', '')}`
			: player?.bio.screen;

		return `MOTM: ${instagram}`;
	}

	if (forwardsMOTM) {
		const player = await getPlayer(forwardsMOTM);
		return `Forwards MOTM: ${player?.social.instagram ?? player?.bio.screen ?? ''}`;
	}

	if (backsMOTM) {
		const player = await getPlayer(backsMOTM);
		return `Backs MOTM: ${player?.social.instagram ?? player?.bio.screen ?? ''}`;
	}

	return '';
}

function getMatchType(match: Match): string {
	return match.detail?.type ?? '';
}

function getMatchTeamsWithResult(match: Match): string {
	const homeTeam = ['HOME', 'NEUTRAL'].includes(match.detail?.venue ?? '')
		? match.team
		: match.opponent;
	const awayTeam = ['HOME', 'NEUTRAL'].includes(match.detail?.venue ?? '')
		? match.opponent
		: match.team;

	const homeResult = match.result?.homeScore.toString() ?? '-';
	const awayResult = match.result?.awayScore.toString() ?? '-';

	if (homeTeam && awayTeam) {
		return `${homeTeam.club} ${homeTeam.squad} ${homeResult} vs ${awayResult} ${awayTeam.club} ${awayTeam.squad}`;
	}

	return '';
}
function getMatchTeams(match: Match): string {
	const homeTeam = ['HOME', 'NEUTRAL'].includes(match.detail?.venue ?? '')
		? match.team
		: match.opponent;
	const awayTeam = ['HOME', 'NEUTRAL'].includes(match.detail?.venue ?? '')
		? match.opponent
		: match.team;

	if (homeTeam && awayTeam) {
		return `${homeTeam.club} ${homeTeam.squad} vs ${awayTeam.club} ${awayTeam.squad}`;
	}

	return '';
}

function getMatchTags(): string {
	const SOCIAL_TAGS = ['#chipstead', '#rugbyUnion', '#nextMatch'];
	return SOCIAL_TAGS.join(' ');
}

function getResultTags(): string {
	const SOCIAL_TAGS = ['#chipstead', '#rugbyUnion', '#result'];
	return SOCIAL_TAGS.join(' ');
}

function getSponsors(): string {
	const SPONSORS = ['@furniturevillage', '@formation_lighting'];
	return SPONSORS.join(' ');
}

function getMatchDetails(match: Match): string {
	const lines: string[] = [];
	const meetAt = convertTime(match.schedule?.meetAt ?? '');
	const kickOffAt = convertTime(match.schedule?.kickOffAt ?? '');

	if (match.schedule?.matchOn) {
		lines.push(`📅 ${matchDate(match.schedule.matchOn)}`);
	} else {
		lines.push(`📅 TBC`);
	}

	lines.push(`⏰ Meet: ${meetAt} - KO: ${kickOffAt}`);
	lines.push(`🏟️ ${match.detail?.address ?? 'TBC'}`);
	return lines.join('\n');
}
