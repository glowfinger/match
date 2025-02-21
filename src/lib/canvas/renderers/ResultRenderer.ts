import { Colours } from '$lib/Constants';
import type { MatchImage } from '$lib/database/IndexedDB';
import canvasSplitter from './CanvasSplitter';

export default async function resultRender(
	matchId: number,
	type: string,
): Promise<Omit<MatchImage, 'id'>[]> {
	const PAGES = 2;
	const WIDTH = 1080;
	const HEIGHT = 1080;

	const canvas = new OffscreenCanvas(PAGES * WIDTH, HEIGHT);

	const ctx = canvas.getContext('2d', { willReadFrequently: true });

	if (!ctx) {
		throw new Error('Failed to get 2D context');
	}

	ctx.fillStyle = Colours.NAVY;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	const TITLE = 'RESULT';
	ctx.font = `140px black`;
	ctx.textAlign = 'left';
	ctx.fillStyle = Colours.WHITE;
	ctx.lineWidth = 16;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText(TITLE, 60, 160);
	ctx.fillText(TITLE, 60, 160);

	return (await canvasSplitter(canvas)).map(({ page, base64 }) => ({
		matchId,
		type,
		page,
		base64,
	}));
}
