import { Colours } from '$lib/Constants';
import type { MatchImage } from '$lib/database/IndexedDB';
import { getMatch } from '$lib/database/MatchService';
import { KIT_VALUES } from '../constants/Colours';
import canvasSplitter from './CanvasSplitter';

const RESULT_BACKGROUND_IMAGE = {
	[KIT_VALUES.MAIN]: '/img/backgrounds/seniors/optist-ngw.png',
	[KIT_VALUES.SECONDARY]: '/img/backgrounds/seniors/optist-png.png',
};

const RESULT_BACKGROUND = {
	[KIT_VALUES.MAIN]: Colours.GOLD,
	[KIT_VALUES.SECONDARY]: Colours.PINK,
};

export default async function resultRender(
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
	// ctx.fillStyle = RESULT_BACKGROUND[match.detail?.kit ?? KIT_VALUES.MAIN];
	// ctx.fillRect(0, 0, canvas.width, canvas.height);

	const mediaImageData = [
		{
			matchId,
			imageType: 'RESULT',
			type: 'PHOTO',
			url: '/img/photos/DSC03236.png',
			x: 0,
			y: -200,
		},
	];

	const mediaImage = mediaImageData.find(
		(image) => image.imageType === 'RESULT' && image.type === 'PHOTO',
	);

	// if (mediaImage) {
	// 	const photo = await getImageBitmap(mediaImage?.url ?? '');
	// 	if (photo) {
	// 		ctx.drawImage(photo, mediaImage?.x ?? 0, mediaImage?.y ?? 0);
	// 	}

	// 	const img = await getImageBitmap(RESULT_BACKGROUND_IMAGE[match.detail?.kit ?? KIT_VALUES.MAIN]);
	// 	ctx.drawImage(img, 0, HEIGHT / 2, canvas.width, canvas.width);
	// }

	// if (match.detail?.venue === 'HOME') {
	// 	{
	// 		const TITLE = [match.team?.club ?? '', match.team?.squad ?? ''].join(' ').trim();
	// 		ctx.font = `80px black`;
	// 		ctx.textAlign = 'left';
	// 		ctx.fillStyle = Colours.GOLD;
	// 		ctx.lineWidth = 8;
	// 		ctx.strokeStyle = Colours.NAVY;
	// 		ctx.strokeText(TITLE, 60, 100);
	// 		ctx.fillText(TITLE, 60, 100);
	// 	}

	// 	{
	// 		const TITLE = ['vs', match.opponent?.club ?? '', match.opponent?.squad ?? '']
	// 			.join(' ')
	// 			.trim();
	// 		ctx.font = `60px regular`;
	// 		ctx.textAlign = 'left';
	// 		ctx.fillStyle = Colours.WHITE;
	// 		ctx.lineWidth = 8;
	// 		ctx.strokeStyle = Colours.NAVY;
	// 		ctx.strokeText(TITLE, 60, 180);
	// 		ctx.fillText(TITLE, 60, 180);
	// 	}
	// } else {
	// 	{
	// 		const TITLE = [match.opponent?.club ?? '', match.opponent?.squad ?? '', 'vs']
	// 			.join(' ')
	// 			.trim();
	// 		ctx.font = `60px regular`;
	// 		ctx.textAlign = 'left';
	// 		ctx.fillStyle = Colours.WHITE;
	// 		ctx.lineWidth = 8;
	// 		ctx.strokeStyle = Colours.NAVY;
	// 		ctx.strokeText(TITLE, 60, 100);
	// 		ctx.fillText(TITLE, 60, 100);
	// 	}
	// 	{
	// 		const TITLE = [match.team?.club ?? '', match.team?.squad ?? ''].join(' ').trim();
	// 		ctx.font = `80px black`;
	// 		ctx.textAlign = 'left';
	// 		ctx.fillStyle = Colours.GOLD;
	// 		ctx.lineWidth = 8;
	// 		ctx.strokeStyle = Colours.NAVY;
	// 		ctx.strokeText(TITLE, 60, 210);
	// 		ctx.fillText(TITLE, 60, 210);
	// 	}
	// }

	if (match.result !== undefined) {
		const { homeScore, awayScore } = match.result;

		const centerHeight = HEIGHT / 2 + 95;

		const homeString = homeScore.toString();
		const awayString = awayScore.toString();

		ctx.font = `260px semiBold`;
		ctx.textAlign = 'center';
		ctx.fillStyle = Colours.WHITE;
		ctx.lineWidth = 16;
		ctx.strokeStyle = Colours.NAVY;

		ctx.strokeText('-', 540, centerHeight);
		ctx.fillText('-', 540, centerHeight);

		ctx.textAlign = 'right';

		ctx.strokeText(homeString, 540 - 80, centerHeight);
		ctx.fillText(homeString, 540 - 80, centerHeight);

		ctx.textAlign = 'left';

		ctx.fillStyle = Colours.GOLD;
		ctx.strokeText(awayString, 540 + 80, centerHeight);
		ctx.fillText(awayString, 540 + 80, centerHeight);
	}

	// await drawSponsors(ctx, 60, 1120);

	return (await canvasSplitter(canvas)).map(({ page, base64 }) => ({
		matchId,
		type,
		page,
		base64,
		createdAt: new Date().toISOString(),
	}));
}
