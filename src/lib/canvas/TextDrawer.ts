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
