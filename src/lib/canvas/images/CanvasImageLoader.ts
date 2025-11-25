import type { Match, MatchTeam } from '$lib/database/IndexedDB';
import type { CanvasImage } from '$lib/types/Images';
import { KIT_VALUES } from '../constants/Colours';
import { getImageBitmap } from '../ImageCache';

const RESULT_BACKGROUND_IMAGE = {
	[KIT_VALUES.MAIN]: '/img/backgrounds/seniors/optist-ngw.png',
	[KIT_VALUES.SECONDARY]: '/img/backgrounds/seniors/optist-png.png',
};

export default async function canvasImageLoader(
	match: Match,
	mediaType: string,
): Promise<CanvasImage[]> {
	const canvasImages: CanvasImage[] = [];
	if (mediaType === 'RESULT') {
		canvasImages.push(...(await resultImageLoader(match)));
	}

	console.log(canvasImages);

	return canvasImages;
}

async function resultImageLoader(match: Match) {
	const images: CanvasImage[] = [];

	const homeTeam = match.detail?.venue === 'HOME' ? match.team : match.opponent;
	const awayTeam = match.detail?.venue === 'HOME' ? match.opponent : match.team;

	if (homeTeam) {
		images.push(await teamImageLoader(homeTeam, 'HOME'));
	}

	if (awayTeam) {
		images.push(await teamImageLoader(awayTeam, 'AWAY'));
	}

	const backgroundImage = await getImageBitmap(
		RESULT_BACKGROUND_IMAGE[match.detail?.kit ?? KIT_VALUES.MAIN],
	);
	images.push({
		photo: backgroundImage,
		uploadType: 'BACKGROUND',
		mediaType: 'RESULT',
		settings: {
			x: 0,
			y: 0,
			zoom: 1,
		},
	});

	return images;
}

async function teamImageLoader(team: MatchTeam, uploadType: string): Promise<CanvasImage> {
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
