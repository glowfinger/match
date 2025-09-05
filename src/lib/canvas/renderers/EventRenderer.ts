import { Colours } from '$lib/Constants';
import type { Event, EventImage } from '$lib/types/Event';
import { splitText } from '../helpers/Text';

export default async function eventRenderer(
	event: Event,
	height: number,
	width: number,
	type: string,
): Promise<Omit<EventImage, 'id'>> {
	const canvas = new OffscreenCanvas(width, height);

	const ctx = canvas.getContext('2d', { willReadFrequently: true });

	if (!ctx) {
		throw new Error('Failed to get 2D context');
	}

	const headline = event.details?.headline ?? '';

	ctx.fillStyle = Colours.NAVY;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.font = `80px headline-flames`;
	ctx.textAlign = 'left';
	ctx.fillStyle = Colours.WHITE;
	ctx.lineWidth = 16;
	ctx.strokeStyle = Colours.NAVY;

	const lines = splitText(ctx, headline, 680);
	const lineHeight = 80;
	const x = 60;
	const y = 160;
	for (const line of lines) {
		// ctx.strokeText(line, x, y + lineHeight * lines.indexOf(line));
		ctx.fillText(line, x, y + lineHeight * lines.indexOf(line));
	}

	ctx.font = `32px cta-flames`;
	ctx.textAlign = 'left';
	ctx.fillStyle = Colours.GOLD;
	ctx.fillText(event.details?.cta ?? '', x, y + lineHeight * lines.length + 36);

	// const highlights = event.details?.highlights.split('\n').filter((h) => h.trim() !== '') ?? [];
	// for (let index = 0; index < highlights.length; index++) {
	// 	const highlight = highlights[index];
	// 	ctx.font = `36px black`;
	// 	ctx.textAlign = 'left';
	// 	ctx.fillStyle = Colours.WHITE;
	// 	ctx.lineWidth = 6;
	// 	ctx.strokeStyle = Colours.NAVY;
	// 	ctx.strokeText(highlight, 60, 360 + index * 40);
	// 	ctx.fillText(highlight, 60, 360 + index * 40);
	// }

	// ctx.font = `36px black`;
	// ctx.textAlign = 'left';
	// ctx.fillStyle = Colours.WHITE;
	// ctx.lineWidth = 6;
	// ctx.strokeStyle = Colours.NAVY;
	// ctx.strokeText(event.details?.footnote ?? '', 60, 460);
	// ctx.fillText(event.details?.footnote ?? '', 60, 460);

	// ctx.font = `36px black`;
	// ctx.textAlign = 'left';
	// ctx.fillStyle = Colours.WHITE;
	// ctx.lineWidth = 6;
	// ctx.strokeStyle = Colours.NAVY;
	// ctx.strokeText(event.details?.body ?? '', 60, 560);
	// ctx.fillText(event.details?.body ?? '', 60, 560);

	const blob = await canvas.convertToBlob({ type: 'image/png' });

	const base64 = await blobToData(blob);
	return {
		eventUuid: event.uuid,
		createdAt: new Date().toISOString(),
		type: type,
		height: height,
		width: width,
		base64: base64 as string,
	};
}

async function blobToData(blob: Blob) {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result);
		reader.readAsDataURL(blob);
	});
}
