import { Colours } from '$lib/Constants';

export function drawTitle(
	ctx: OffscreenCanvasRenderingContext2D,
	title: string,
	x: number,
	y: number,
) {
	ctx.font = `140px black`;
	ctx.textAlign = 'left';
	ctx.fillStyle = Colours.WHITE;
	ctx.lineWidth = 16;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText(title, x, y);
	ctx.fillText(title, x, y);
}

export function drawVersusTitle(
	ctx: OffscreenCanvasRenderingContext2D,
	text: string,
	x: number,
	y: number,
): void {
	ctx.font = `40px regular`;
	ctx.textAlign = 'left';

	ctx.lineWidth = 6;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText(text, x, y);

	ctx.fillStyle = Colours.WHITE;
	ctx.fillText(text, x, y);
}
