import type { Match } from '$lib/database/IndexedDB';
import { getUploadsByMatchIdAndMediaType } from '$lib/database/match/ImageUploadDBService';
import type { CanvasImage } from '$lib/types/Images';
import { KIT_VALUES } from '../constants/Colours';
import { getImageBitmap } from '../ImageCache';
import { sponsorImageLoader, teamBadgeLoader } from './ImageLoaderUtils';

const KIT_BACKGROUND_IMAGE = {
	[KIT_VALUES.MAIN]: '/img/backgrounds/seniors/match-navy.png',
	[KIT_VALUES.SECONDARY]: '/img/backgrounds/seniors/match-pink.png',
};

const KIT_BACKGROUND_IMAGE_CUTOUT = {
	[KIT_VALUES.MAIN]: '/img/backgrounds/seniors/match-navy-cutout.png',
	[KIT_VALUES.SECONDARY]: '/img/backgrounds/seniors/match-pink-cutout.png',
};

export default async function matchImageLoader(match: Match): Promise<CanvasImage[]> {
	const images: CanvasImage[] = [];

	if (match.detail) {
		const promises = [
			getImageBitmap(KIT_BACKGROUND_IMAGE[match.detail.kit]),
			getImageBitmap(KIT_BACKGROUND_IMAGE_CUTOUT[match.detail.kit]),
		];

		const [backgroundImage, backgroundCutoutImage] = await Promise.all(promises);

		const settings = {
			x: 0,
			y: 0,
			zoom: 1,
		};
		images.push({
			photo: backgroundImage,
			uploadType: 'BACKGROUND',
			mediaType: 'MATCH',
			settings,
		});

		images.push({
			photo: backgroundCutoutImage,
			uploadType: 'BACKGROUND_CUTOUT',
			mediaType: 'MATCH',
			settings,
		});
	}

	const uploads = await getUploadsByMatchIdAndMediaType(match.id, 'MATCH');

	const mainUpload = uploads.find((upload) => upload.uploadType === 'main');
	if (mainUpload) {
		images.push({
			photo: await createImageBitmap(mainUpload.blob),
			uploadType: 'UPLOAD',
			mediaType: 'MAIN',
			settings: mainUpload.settings,
		});
	}

	images.push(...(await teamBadgeLoader(match)));
	images.push(...(await sponsorImageLoader(match)));

	return images;
}
