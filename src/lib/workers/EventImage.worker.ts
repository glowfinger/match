import eventRenderer from '$lib/canvas/renderers/EventRenderer';
import { getEvent } from '$lib/database/event/EventDBService';
import { setEventImage } from '$lib/database/event/EventImageDBService';
import { getFonts } from '$lib/database/FontDBService';
import type { EventImage } from '$lib/types/Event';

onmessage = async (e: MessageEvent) => {
	await preloadFonts();
	const [error, event] = await getEvent(e.data);
	if (error) {
		postMessage({ task: 'EVENT_NOT_FOUND', data: error });
		return;
	}

	const images: Omit<EventImage, 'id'>[] = [];

	images.push(await eventRenderer(event, 1080, 1080, 'SQUARE'));

	for await (const image of images) {
		await setEventImage(image);
		postMessage({ task: 'EVENT_IMAGE_GENERATED' });
	}
};

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
