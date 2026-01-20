import { Colours } from '$lib/Constants';

export default function nameTagDrawer(
	ctx: CanvasRenderingContext2D,
	name: string,
	x: number,
	y: number,
): void {
	ctx.fillStyle = 'white';
	ctx.fillRect(x, y, 260, 40);
	ctx.strokeStyle = Colours.NAVY;
	ctx.lineWidth = 3;
	ctx.strokeRect(x, y, 260, 40);
	ctx.font = `24px semiBold`;
	ctx.textAlign = 'center';
	ctx.fillStyle = 'black';
	ctx.fillText(name, x + 130, y + 30);
}
