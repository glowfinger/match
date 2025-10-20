import { Colours } from '$lib/Constants';
import type { MatchImage } from '$lib/database/IndexedDB';
import { getMatch } from '$lib/database/MatchService';
import { KIT_BACKGROUND, KIT_VALUES } from '../constants/Colours';
import { drawSponsors } from '../drawers/SponsorsDrawer';
import { getImageBitmap } from '../ImageCache';
import canvasSplitter from './CanvasSplitter';

export default async function LineupListRenderer(
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

	if (match.detail) {
		ctx.fillStyle = KIT_BACKGROUND[match.detail?.kit ?? KIT_VALUES.MAIN];
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	} else {
		ctx.fillStyle = KIT_BACKGROUND[KIT_VALUES.MAIN];
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	let y = 160;

	{
		const img = await getImageBitmap('/img/backgrounds/seniors/senior-gold-1-panel-basic.png');
		ctx.drawImage(img, 0, 0);
	}

	{
		const img = await getImageBitmap('/img/photos/props.png');
		ctx.drawImage(img, 0, 0);
	}

	{
		const img = await getImageBitmap('/img/examples/13.png');
		ctx.drawImage(img, 0, 290);
	}
	if (match.team) {
		const title = [match.team.squad, 'LINEUP'].join(' ').trim();
		const size = 140;
		ctx.font = `${size}px black`;
		ctx.textAlign = 'left';
		ctx.fillStyle = Colours.WHITE;
		ctx.lineWidth = 16;
		ctx.strokeStyle = Colours.NAVY;
		ctx.strokeText(title, 60, y);
		ctx.fillText(title, 60, y);
		y += 20;
	}

	if (match.detail) {
		// Match type
		const size = 60;
		const margin = 20;

		ctx.font = `${size}px black`;
		ctx.textAlign = 'left';
		ctx.lineWidth = 12;
		ctx.fillStyle = Colours.GOLD;
		ctx.strokeStyle = Colours.NAVY;

		const lines = match.detail.type.split('\n');

		lines.forEach((line, index) => {
			ctx.strokeText(line, 60, y + index * size + size);
			ctx.fillText(line, 60, y + index * size + size);
			y += 16;
		});

		y += size + lines.length * size + margin;
	}
	const awayTeam = match.detail?.venue === 'HOME' ? match.opponent : match.team;
	if (awayTeam) {
		const x1 = 60;
		const y1 = y - 100;
		const lineHeight = 54;

		const lines = [['vs', awayTeam.club, awayTeam.squad].join(' ')];
		ctx.font = `${lineHeight}px regular`;
		ctx.textAlign = 'left';
		ctx.lineWidth = 8;
		ctx.fillStyle = Colours.WHITE;
		ctx.strokeStyle = Colours.NAVY;
		lines.forEach((line, index) => {
			ctx.strokeText(line, x1, y1 + 95 + index * 40);
			ctx.fillText(line, x1, y1 + 95 + index * 40);
		});
	}

	// await drawBadge(ctx, match, 60, y - 40);

	await drawSponsors(ctx, 60, 1120);

	return (await canvasSplitter(canvas)).map(({ page, base64 }) => ({
		matchId,
		type,
		page,
		base64,
		createdAt: new Date().toISOString(),
	}));
}
