import { Colours } from '$lib/Constants';
import canvasSplitter from './CanvasSplitter';

export default async function cancelledRender(matchId: number, type: string) {
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

	// Title
	ctx.font = `140px black`;
	ctx.textAlign = 'left';
	ctx.fillStyle = Colours.WHITE;
	ctx.lineWidth = 16;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText('CANCELLED', 60, 160);
	ctx.fillText('CANCELLED', 60, 160);

	const img = await fetch(
		'https://glowfinger.blob.core.windows.net/smg/background-removed/DSC03345.png',
	)
		.then((response) => response.blob())
		.then(async (blob) => await createImageBitmap(blob));

	ctx.drawImage(img, 500, 280, 1000, 800);

	return (await canvasSplitter(canvas)).map(({ page, base64 }) => ({
		matchId,
		type,
		page,
		base64,
	}));
}
