import { Colours, SPONSORS } from '$lib/Constants';
import type { MatchImage } from '$lib/database/IndexedDB';
import { getMatch } from '$lib/database/MatchService';
import { getImageBitmap } from '../ImageCache';
import canvasSplitter from './CanvasSplitter';

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

	ctx.fillStyle = Colours.NAVY;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	{
		let url = '/img/backgrounds/seniors/senior-navy-3240-1080.png';
		if (match.detail?.kit !== 'MAIN') {
			url = '/img/backgrounds/seniors/senior-pink-3240-1080.png';
		}

		const img = await getImageBitmap(url);
		ctx.drawImage(img, 0, 0);
	}

	// Team squad
	if (match.team) {
		const team = [match.team.club ?? '', match.team.squad ?? ''].join(' ');
		ctx.font = `100px black`;
		ctx.textAlign = 'center';
		ctx.fillStyle = Colours.WHITE;
		ctx.lineWidth = 16;
		ctx.strokeStyle = Colours.NAVY;
		ctx.strokeText(team, 540, 200);
		ctx.fillText(team, 540, 200);
	}

	// Match type
	if (match.detail) {
		ctx.font = `30px black`;
		ctx.textAlign = 'left';
		ctx.fillStyle = Colours.WHITE;
		ctx.lineWidth = 4;
		ctx.strokeStyle = Colours.NAVY;
		ctx.strokeText(match.detail.type, 60, 360);
		ctx.fillText(match.detail.type, 60, 360);
	}

	if (match.team) {
		const lines = [match.team.club, match.team.squad];
		const lineHeight = 54;
		const x = 440;
		const y = 380;

		ctx.font = `${lineHeight}px regular`;
		ctx.textAlign = 'right';
		ctx.lineWidth = 6;
		ctx.fillStyle = Colours.WHITE;
		ctx.strokeStyle = Colours.NAVY;
		lines.forEach((line, index) => {
			ctx.strokeText(line, x, y + index * lineHeight);
			ctx.fillText(line, x, y + index * lineHeight);
		});
	}

	if (match.team && match.opponent) {
		const text = 'vs';
		const lineHeight = 48;
		const x = 540;
		const y = 400;
		ctx.font = `${lineHeight}px regular`;
		ctx.textAlign = 'center';
		ctx.lineWidth = 6;
		ctx.fillStyle = Colours.WHITE;
		ctx.strokeStyle = Colours.NAVY;
		ctx.strokeText(text, x, y);
		ctx.fillText(text, x, y);
	}

	if (match.opponent) {
		const lines = [match.opponent.club, match.opponent.squad];
		const lineHeight = 54;
		const x = 640;
		const y = 380;
		ctx.font = `${lineHeight}px regular`;
		ctx.textAlign = 'left';
		ctx.lineWidth = 6;
		ctx.fillStyle = Colours.WHITE;
		ctx.strokeStyle = Colours.NAVY;
		lines.forEach((line, index) => {
			ctx.strokeText(line, x, y + index * lineHeight);
			ctx.fillText(line, x, y + index * lineHeight);
		});
	}

	// if (match.team) {
	// 	const img = await getImageBitmap(match.team.badge);
	// 	ctx.drawImage(img, 500, 280, 150, 150);
	// }

	// if (match.opponent) {
	// 	const img = await getImageBitmap(match.opponent.badge);
	// 	ctx.drawImage(img, 500, 480, 150, 150);
	// }

	// if (match.schedule) {
	// 	const date = matchDate(match.schedule.matchOn);
	// 	ctx.font = `36px regular`;
	// 	ctx.textAlign = 'left';
	// 	ctx.lineWidth = 6;
	// 	ctx.fillStyle = Colours.WHITE;
	// 	ctx.strokeStyle = Colours.NAVY;
	// 	ctx.strokeText(date, 60, 540);
	// 	ctx.fillText(date, 60, 540);

	// 	const times = `Meet: ${convertTime(match.schedule.meetAt ?? '')} - KO: ${convertTime(match.schedule.kickOffAt ?? '')}`;
	// 	ctx.font = `36px regular`;
	// 	ctx.textAlign = 'left';
	// 	ctx.lineWidth = 6;
	// 	ctx.fillStyle = Colours.WHITE;
	// 	ctx.strokeStyle = Colours.NAVY;
	// 	ctx.strokeText(times, 60, 640);
	// 	ctx.fillText(times, 60, 640);
	// }

	// if (match.detail) {
	// 	ctx.font = `36px regular`;
	// 	ctx.textAlign = 'left';
	// 	ctx.lineWidth = 6;
	// 	ctx.fillStyle = Colours.WHITE;
	// 	ctx.strokeStyle = Colours.NAVY;
	// 	ctx.strokeText(match.detail.address, 60, 740);
	// 	ctx.fillText(match.detail.address, 60, 740);
	// }

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
		createdAt: new Date().toISOString(),
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

export function splitIntoLines(text: string): string[] {
	if (!text) {
		return [];
	}

	return text
		.trim()
		.replace(/ +(?= )/g, '')
		.split('\n')
		.filter((n) => n);
}
