import type { Match } from '$lib/database/IndexedDB';
import type { CanvasImage } from '$lib/types/Images';
import { KIT_VALUES } from '../constants/Colours';

const RESULT_BACKGROUND_IMAGE = {
	[KIT_VALUES.MAIN]: '/img/backgrounds/seniors/optist-ngw.png',
	[KIT_VALUES.SECONDARY]: '/img/backgrounds/seniors/optist-png.png',
};

export default async function matchImageLoader(match: Match): Promise<CanvasImage[]> {
	const images: CanvasImage[] = [];

	return images;
}
