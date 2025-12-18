import type { Match, MatchTeam } from '$lib/database/IndexedDB';
import { getMatchPositions } from '$lib/database/MatchPositionDBService';
import { getPlayersByKeys } from '$lib/database/PlayerDBService';
import type { CanvasImage } from '$lib/types/Images';
import { getImageBitmap } from '../ImageCache';
import headshotLoader from './HeadshotLoader';

export async function teamImageLoader(team: MatchTeam, uploadType: string): Promise<CanvasImage> {
	const img = await getImageBitmap(team.badge);
	return {
		photo: img,
		uploadType: uploadType,
		mediaType: 'TEAM',
		settings: {
			x: 0,
			y: 0,
			zoom: 1,
		},
	};
}

export async function teamBadgeLoader(match: Match): Promise<CanvasImage[]> {
	const images: CanvasImage[] = [];

	const homeTeam = match.detail?.venue === 'HOME' ? match.team : match.opponent;
	const awayTeam = match.detail?.venue === 'HOME' ? match.opponent : match.team;

	if (homeTeam) {
		images.push(await teamImageLoader(homeTeam, 'HOME'));
	}

	if (awayTeam) {
		images.push(await teamImageLoader(awayTeam, 'AWAY'));
	}

	return images;
}

export async function playerHeadshotLoader(match: Match): Promise<CanvasImage[]> {
	const images: CanvasImage[] = [];

	const positions = await getMatchPositions(match.id);
	const playerKeys = positions.filter((p) => p.type === 'start').map((p) => p.playerKey);
	const players = await getPlayersByKeys(playerKeys);

	for (const position of positions) {
		const player = players.find((p) => p.key === position.playerKey);
		if (player) {
			const image = await headshotLoader(match.detail?.kit ?? 'MAIN', player);
			images.push({
				photo: image,
				uploadType: position.position,
				mediaType: 'POSITION',
				settings: {
					x: 0,
					y: 0,
					zoom: 1,
				},
			});
		}
	}

	return images;
}
