import { Colours, SPONSORS } from '$lib/Constants';
import type { MatchImage } from '$lib/database/IndexedDB';
import { getMatch } from '$lib/database/MatchService';
import canvasSplitter from './CanvasSplitter';

type ContentBackground = {
	type: 'BACKGROUND';
	page: number;
	color: string;
};

type ContentImage = {
	type: 'image';
	page: number;
	src: string;
	position: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
};

type ContentItem = ContentBackground | ContentImage | ContentTitle;

type ContentTitle = {
	type: 'TITLE';
	page: number;
	text: string;
	x: number;
	y: number;
};

const content: ContentItem[] = [
	{ page: 1, type: 'BACKGROUND', color: Colours.PINK },
	{
		page: 1,
		type: 'image',
		src: '/img/backgrounds/seniors/pink-1080-1350-1-panel.png',
		position: { x: 0, y: 0, width: 1080, height: 1350 },
	},
	{ page: 1, type: 'TITLE', text: 'NEXT MATCH', x: 60, y: 160 },
];

export default async function matchRenderer(
	matchId: number,
	type: string,
): Promise<Omit<MatchImage, 'id'>[]> {
	const PAGES = 1;
	const WIDTH = 1080;
	const HEIGHT = 1350;

	const canvas = new OffscreenCanvas(PAGES * WIDTH, HEIGHT);
	const ctx = canvas.getContext('2d', { willReadFrequently: true });
	if (!ctx) {
		throw new Error('Failed to get 2D context');
	}

	const match = await getMatch(matchId);

	// const kit = match.detail?.kit ?? 'MAIN';

	// if (kit === 'MAIN') {
	// 	ctx.fillStyle = Colours.NAVY;
	// } else {
	// 	ctx.fillStyle = Colours.PINK;
	// }
	// // ctx.fillStyle = Colours.NAVY;
	// ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (const item of content) {
		console.log(item);
		if (item.type === 'BACKGROUND') {
			drawBackground(ctx, canvas.width, canvas.height, item.color);
		}

		if (item.type === 'TITLE') {
			drawTitle(ctx, item.text, item.x, item.y);
		}
	}

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

	// ctx.font = `80px black`;
	// ctx.textAlign = 'left';
	// ctx.lineWidth = 12;
	// ctx.strokeStyle = Colours.NAVY;
	// ctx.fillStyle = Colours.GOLD;
	// ctx.strokeText(team, 60, 280);
	// ctx.fillText(team, 60, 280);

	// VS
	// ctx.font = `40px regular`;
	// ctx.textAlign = 'left';
	// ctx.lineWidth = 6;
	// ctx.fillStyle = Colours.WHITE;
	// ctx.strokeStyle = Colours.NAVY;
	// ctx.strokeText('vs', 60, 360);
	// ctx.fillText('vs', 60, 360);

	// const opponent = `${match.opponent?.club ?? ''} ${match.opponent?.squad ?? ''}`;
	// Opposition team
	// ctx.font = `80px regular`;
	// ctx.textAlign = 'left';
	// ctx.lineWidth = 6;
	// ctx.fillStyle = Colours.WHITE;
	// ctx.strokeStyle = Colours.NAVY;
	// ctx.strokeText(opponent, 60, 360);
	// ctx.fillText(opponent, 60, 360);

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

function drawBackground(
	ctx: OffscreenCanvasRenderingContext2D,
	width: number,
	height: number,
	color: string,
) {
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, width, height);
}

function drawTitle(ctx: OffscreenCanvasRenderingContext2D, text: string, x: number, y: number) {
	ctx.font = `140px black`;
	ctx.textAlign = 'left';
	ctx.fillStyle = Colours.WHITE;
	ctx.lineWidth = 16;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText(text, x, y);
	ctx.fillText(text, x, y);
}
