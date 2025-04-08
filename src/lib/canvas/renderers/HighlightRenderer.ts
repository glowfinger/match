import { Colours } from '$lib/Constants';
import {
	getImagesByType,
	hasImagesByType,
	saveImages,
} from '$lib/database/BackgroundImageDbService';
import type { MatchImage } from '$lib/database/IndexedDB';
import { getMatch } from '$lib/database/MatchService';
import Backgrounds from '../constants/lineup/Backgrounds';
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

	console.log(img.width);

	// make image fit in 500x500

	ctx.drawImage(img, 500, 280);

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
