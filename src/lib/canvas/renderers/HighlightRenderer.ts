import { hasImagesByType } from '$lib/database/BackgroundImageDbService';
import type { MatchImage } from '$lib/database/IndexedDB';
import Backgrounds from '../constants/lineup/Backgrounds';

export default async function HighlightRenderer(
	matchId: number,
	type: string,
): Promise<Omit<MatchImage, 'id'>[]> {
	// const PAGES = 4;
	// const WIDTH = 1080;
	// const HEIGHT = 1080;

	const downloadImages = await hasImagesByType(type);

	if (!downloadImages) {
		// const found = Backgrounds.find((image) => image.key === type);
		// const images: Array<Promise<string>> = [];
		// if (found) {
		// 	found.images.forEach((image) => {
		// 		images.push(imageToBase64(image));
		// 	});
		// }

		const strings = await Promise.all([imageToBase64(Backgrounds[0].images[0])]);

		console.log(strings);
	}
	return [];
}

async function imageToBase64(url: string): Promise<string> {
	const response = await fetch(url);
	const arrayBuffer = await response.arrayBuffer();
	// const base64String = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

	return `data:image/jpeg;base64,`;
}
