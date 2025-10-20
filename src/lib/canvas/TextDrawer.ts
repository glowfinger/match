import { Colours } from '$lib/Constants';

type CanvasContext = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;

export function drawTitle(ctx: CanvasContext, title: string, x: number, y: number) {
	ctx.font = `140px black`;
	ctx.textAlign = 'left';
	ctx.fillStyle = Colours.WHITE;
	ctx.lineWidth = 16;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText(title, x, y);
	ctx.fillText(title, x, y);
}

export function drawSmallTitle(ctx: CanvasContext, text: string, x: number, y: number): void {
	ctx.font = `80px black`;
	ctx.textAlign = 'left';

	ctx.lineWidth = 12;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText(text, x, y);

	ctx.fillStyle = Colours.GOLD;
	ctx.fillText(text, x, y);
}

export function drawVersusTitle(ctx: CanvasContext, text: string, x: number, y: number): void {
	ctx.font = `50px regular`;
	ctx.textAlign = 'left';

	ctx.lineWidth = 6;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText(text, x, y);

	ctx.fillStyle = Colours.WHITE;
	ctx.fillText(text, x, y);
}
