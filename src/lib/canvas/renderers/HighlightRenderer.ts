import { Colours } from '$lib/Constants';
import {
	getImagesByType,
	hasImagesByType,
	saveImages,
} from '$lib/database/BackgroundImageDbService';
import type { MatchImage } from '$lib/database/IndexedDB';
import { getMatch } from '$lib/database/MatchService';
import Backgrounds from '../constants/lineup/Backgrounds';
<<<<<<< HEAD
=======
import { drawTitle } from '../TextDrawer';
>>>>>>> 8df9c91597c8025ceaf84f9411d6988b00693ad7
import canvasSplitter from './CanvasSplitter';

export default async function HighlightRenderer(
	matchId: number,
	type: string,
): Promise<Omit<MatchImage, 'id'>[]> {
	const PAGES = 1;
	const WIDTH = 1080;
	const HEIGHT = 1080;

	const canvas = new OffscreenCanvas(PAGES * WIDTH, HEIGHT);
	const ctx = canvas.getContext('2d', { willReadFrequently: true });
	if (!ctx) {
		throw new Error('Failed to get 2D context');
	}

	const downloadImages = await hasImagesByType(type);

	if (!downloadImages) {
		const found = Backgrounds.find((image) => image.key === type);

		if (found) {
			const strings = await Promise.all(found.images.map(imageToBase64));
			const backgrounds = strings.map((image, index) => ({ type, page: index + 1, blob: image }));
			await saveImages(backgrounds);
		}
	}

	const match = await getMatch(matchId);

	ctx.fillStyle = Colours.NAVY;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	const images = await getImagesByType(type);
	const blob = images[0]?.blob;

	ctx.drawImage(await createImageBitmap(blob), 0, 0);

	const img = await fetch(
		'https://glowfinger.blob.core.windows.net/smg/background-removed/DSC02490.png',
	)
		.then((response) => response.blob())
		.then(async (blob) => await createImageBitmap(blob));

<<<<<<< HEAD
	console.log(img.width);

	// make image fit in 500x500

	ctx.drawImage(img, 500, 280);
=======
	// Scale image to fit within 500x500 while maintaining aspect ratio
	const maxDimension = 700;
	let imgWidth = img.width;
	let imgHeight = img.height;

	if (imgWidth > maxDimension || imgHeight > maxDimension) {
		const scale = Math.min(maxDimension / imgWidth, maxDimension / imgHeight);
		imgWidth *= scale;
		imgHeight *= scale;
	}

	ctx.drawImage(img, -50, 1080 - imgHeight, imgWidth, imgHeight);

	const img2 = await fetch(
		'https://glowfinger.blob.core.windows.net/smg/background-removed/DSC02092.png',
	)
		.then((response) => response.blob())
		.then(async (blob) => await createImageBitmap(blob));

	// Scale image to fit within 500x500 while maintaining aspect ratio

	let imgWidth2 = img2.width;
	let imgHeight2 = img2.height;

	if (imgWidth2 > maxDimension || imgHeight2 > maxDimension) {
		const scale = Math.min(maxDimension / imgWidth2, maxDimension / imgHeight2);
		imgWidth2 *= scale;
		imgHeight2 *= scale;
	}

	ctx.drawImage(img2, 500, 1080 - imgHeight2, imgWidth2, imgHeight2);

	drawTitle(ctx, 'TRY OF', 50, 120);
	drawTitle(ctx, 'THE WEEK', 50, 260);
>>>>>>> 8df9c91597c8025ceaf84f9411d6988b00693ad7

	return (await canvasSplitter(canvas)).map(({ page, base64 }) => ({
		matchId,
		type,
		page,
		base64,
	}));
}

async function imageToBase64(url: string): Promise<Blob> {
	const response = await fetch(url);
	const blob = await response.blob();

	return blob;
}
