import cancelledRender from '$lib/canvas/renderers/CancelledRenderer';
import matchRenderer from '$lib/canvas/renderers/MatchRenderer';
import resultRender from '$lib/canvas/renderers/ResultRenderer';
import { getFonts } from '$lib/database/FontDBService';
import type { MatchImage } from '$lib/database/IndexedDB';
import { setMatchImage } from '$lib/database/match/MatchImageDBService';
import { getMatch } from '$lib/database/MatchService';

onmessage = async ({ data }: MessageEvent) => {
	await preloadFonts();

	postMessage({ task: 'FONTS_LOADED', type: data.type });

	let images: Omit<MatchImage, 'id'>[] = [];

	if (data.type === 'MATCH') {
		const match = await getMatch(data.matchId);
		images = await matchRenderer(match, data.type);
	}

	if (data.type === 'CANCELLED') {
		images = await cancelledRender(data.matchId, data.type);
	}

	if (data.type === 'RESULT') {
		images = await resultRender(data.matchId, data.type);
	}

	if (!images.length) {
		postMessage({ task: 'NO_IMAGES_GENERATED', type: data.type });
		return;
	}

	await saveImages(images);
	postMessage({ task: 'IMAGES_GENERATED', type: data.type });
};

async function saveImages(images: Omit<MatchImage, 'id'>[]) {
	for await (const image of images) {
		await setMatchImage(image);
	}
}

function addFont(f: FontFace) {
	// @ts-expect-error: Property 'fonts' does not exist on type 'Global'.
	self.fonts.add(f);
}

async function preloadFonts() {
	const fonts = await getFonts();

	for await (const font of fonts) {
		await new FontFace(font.type, font.blob).load().then(addFont);
	}
}
