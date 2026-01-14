import type { Match } from '$lib/database/IndexedDB';
import type { CanvasImage } from '$lib/types/Images';
import lineupImageLoader from './LineupImageLoader';
import matchImageLoader from './MatchImageLoader';
import resultImageLoader from './ResultImageLoader';

export default async function canvasImageLoader(
	match: Match,
	mediaType: string,
): Promise<CanvasImage[]> {
	const canvasImages: CanvasImage[] = [];
	if (mediaType === 'RESULT') {
		canvasImages.push(...(await resultImageLoader(match)));
	}

	if (mediaType === 'LINEUP') {
		canvasImages.push(...(await lineupImageLoader(match)));
	}

	if (mediaType === 'MATCH') {
		canvasImages.push(...(await matchImageLoader(match)));
	}

	return canvasImages;
}
