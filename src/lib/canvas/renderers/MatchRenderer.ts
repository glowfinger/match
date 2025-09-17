import { Colours, SPONSORS } from '$lib/Constants';
import type { MatchImage } from '$lib/database/IndexedDB';
import { getMatch } from '$lib/database/MatchService';
import canvasSplitter from './CanvasSplitter';

export default async function matchRenderer(
	matchId: number,
	type: string,
): Promise<Omit<MatchImage, 'id'>[]> {
	const PAGES = 4;
	const WIDTH = 1080;
	const HEIGHT = 1350;

	const canvas = new OffscreenCanvas(PAGES * WIDTH, HEIGHT);
	const ctx = canvas.getContext('2d', { willReadFrequently: true });
	if (!ctx) {
		throw new Error('Failed to get 2D context');
	}

	const match = await getMatch(matchId);

	// ctx.fillStyle = Colours.NAVY;
	// ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Title
	ctx.font = `140px black`;
	ctx.textAlign = 'left';
	ctx.fillStyle = Colours.WHITE;
	ctx.lineWidth = 16;
	ctx.strokeStyle = Colours.NAVY;
	// ctx.strokeText('NEXT MATCH', 60, 160);
	// ctx.fillText('NEXT MATCH', 60, 160);

	// const back = await fetch('/img/backgrounds/seniors/senior-pink-3240-1080.png')
	// 	.then((response) => response.blob())
	// 	.then(async (blob) => await createImageBitmap(blob));

	// ctx.drawImage(back, 0, 0);

	// const img = await fetch(
	// 	'https://glowfinger.blob.core.windows.net/smg/background-removed/DSC03123.png',
	// )
	// 	.then((response) => response.blob())
	// 	.then(async (blob) => await createImageBitmap(blob));

	// ctx.drawImage(img, 500, 280, 1000, 800);

	// await drawSponsors(ctx);

	// Team name

	const team = `${match.team?.club ?? ''} ${match.team?.squad ?? ''}`;

	ctx.font = `80px black`;
	ctx.textAlign = 'left';
	ctx.lineWidth = 12;
	ctx.strokeStyle = Colours.NAVY;
	ctx.fillStyle = Colours.GOLD;
	// ctx.strokeText(team, 60, 280);
	// ctx.fillText(team, 60, 280);

	// VS
	ctx.font = `40px regular`;
	ctx.textAlign = 'left';
	ctx.lineWidth = 6;
	ctx.fillStyle = Colours.WHITE;
	ctx.strokeStyle = Colours.NAVY;
	// ctx.strokeText('vs', 60, 360);
	// ctx.fillText('vs', 60, 360);

	const opponent = `${match.opponent?.club ?? ''} ${match.opponent?.squad ?? ''}`;
	// Opposition team
	ctx.font = `80px regular`;
	ctx.textAlign = 'left';
	ctx.lineWidth = 6;
	ctx.fillStyle = Colours.WHITE;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText(opponent, 60, 360);
	ctx.fillText(opponent, 60, 360);

	return (await canvasSplitter(canvas)).map(({ page, base64 }) => ({
		matchId,
		type,
		page,
		base64,
	}));
}

async function drawSponsors(ctx: OffscreenCanvasRenderingContext2D) {
	const images = await Promise.all(
		SPONSORS.map(async (sponsor) => {
			return await fetch(sponsor.logo)
				.then((response) => response.blob())
				.then(async (blob) => await createImageBitmap(blob));
		}),
	);
	images.forEach((img, i) => {
		const x = 60 + i * 180;
		const y = 900;
		ctx.lineWidth = 2;
		ctx.strokeStyle = Colours.BLACK;
		ctx.fillStyle = Colours.WHITE;
		ctx.fillRect(x, y, 120, 120);
		ctx.strokeRect(x, y, 120, 120);

		ctx.drawImage(img, x + 10, y + 10);
	});
}
