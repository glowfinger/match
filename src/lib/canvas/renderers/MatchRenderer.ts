import { Colours, UploadImageTypes } from '$lib/Constants';
import type { MatchImage } from '$lib/database/IndexedDB';
import { getUploadByMatchAndTypes } from '$lib/database/match/MatchImageUploadDBService';
import { getMatch } from '$lib/database/MatchService';
import { KIT_VALUES } from '../constants/Colours';
import photoDrawer from '../drawers/PhotoDrawer';
import canvasSplitter from './CanvasSplitter';

export const backgrounds = {
	[KIT_VALUES.MAIN]: Colours.NAVY,
	[KIT_VALUES.SECONDARY]: Colours.PINK,
};

export default async function matchRenderer(
	canvas: OffscreenCanvas | HTMLCanvasElement,
	matchId: number,
	type: string,
): Promise<Omit<MatchImage, 'id'>[]> {
	const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	if (!ctx) {
		throw new Error('Failed to get 2D context');
	}

	const match = await getMatch(matchId);

	ctx.fillStyle = backgrounds[match.detail?.kit ?? KIT_VALUES.MAIN];
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	const uploads = await getUploadByMatchAndTypes(matchId, type, UploadImageTypes.MAIN);
	if (uploads) {
		const img = await createImageBitmap(uploads.blob);

		const destination = { width: 200, height: 200, x: 100, y: 250 };

		await photoDrawer(
			ctx,
			img,
			destination,
			{ width: img.width, height: img.height, x: 0, y: 0 },
			uploads.settings.zoom,
			uploads.settings.x,
			uploads.settings.y,
		);

		// function setImageSize(
		// 	canvasWidth: number,
		// 	canvasHeight: number,
		// 	imageWidth: number,
		// 	imageHeight: number,
		// 	zoom: number,
		// 	x: number,
		// 	y: number,
		// ) {
		// 	const aspectRatio = imageWidth / imageHeight;
		// 	let newWidth = canvasWidth;
		// 	let newHeight = canvasHeight;

		// 	if (aspectRatio > 1) {
		// 		newHeight = canvasWidth / aspectRatio;
		// 	} else {
		// 		newWidth = canvasHeight * aspectRatio;
		// 	}

		// 	return {
		// 		newWidth,
		// 		newHeight,
		// 		x: x + (canvasWidth - newWidth) / 2,
		// 		y: y + (canvasHeight - newHeight) / 2,
		// 	};
		// }

		// const { newWidth, newHeight, x, y } = setImageSize(
		// 	canvas.width,
		// 	canvas.height,
		// 	img.width,
		// 	img.height,
		// 	uploads.settings.zoom,
		// 	uploads.settings.x,
		// 	uploads.settings.y,
		// );
		// ctx.drawImage(img, x, y, newWidth, newHeight);
	}

	// {
	// 	const url = '/img/examples/match-icon.png';
	// 	const response = await fetch(url).then((response) => response.blob());

	// 	const img = await createImageBitmap(response);
	// 	ctx.drawImage(img, 0, 0);
	// }

	const homeTeam = match.detail?.venue === 'HOME' ? match.team : match.opponent;
	const awayTeam = match.detail?.venue === 'HOME' ? match.opponent : match.team;

	// if (homeTeam) {
	// 	const x = 60;
	// 	const y = 560;
	// 	const lineHeight = 54;
	// 	ctx.fillStyle = Colours.WHITE;
	// 	ctx.lineWidth = 1;
	// 	ctx.strokeStyle = Colours.BLACK;
	// 	ctx.fillRect(x, y, 170, 170);
	// 	ctx.strokeRect(x, y, 170, 170);

	// 	const img = await getImageBitmap(homeTeam.badge);
	// 	ctx.drawImage(img, x + 10, y + 10);

	// 	const lines = [homeTeam.club, homeTeam.squad];
	// 	ctx.font = `${lineHeight}px regular`;
	// 	ctx.textAlign = 'left';
	// 	ctx.lineWidth = 6;
	// 	ctx.fillStyle = Colours.WHITE;
	// 	ctx.strokeStyle = Colours.NAVY;
	// 	lines.forEach((line, index) => {
	// 		ctx.strokeText(line, x + 170 + 30, y + 75 + index * lineHeight + 10);
	// 		ctx.fillText(line, x + 170 + 30, y + 75 + index * lineHeight + 10);
	// 	});
	// }

	// // Away team
	// if (awayTeam) {
	// 	const x = 60;
	// 	const y = 760;
	// 	const lineHeight = 54;

	// 	ctx.fillStyle = Colours.WHITE;
	// 	ctx.lineWidth = 1;
	// 	ctx.strokeStyle = Colours.BLACK;
	// 	ctx.fillRect(x, y, 170, 170);
	// 	ctx.strokeRect(x, y, 170, 170);

	// 	const img = await getImageBitmap(awayTeam.badge);
	// 	ctx.drawImage(img, x + 10, y + 10);

	// 	const lines = [awayTeam.club, awayTeam.squad];
	// 	ctx.font = `${lineHeight}px regular`;
	// 	ctx.textAlign = 'left';
	// 	ctx.lineWidth = 6;
	// 	ctx.fillStyle = Colours.WHITE;
	// 	ctx.strokeStyle = Colours.NAVY;
	// 	lines.forEach((line, index) => {
	// 		ctx.strokeText(line, x + 170 + 30, y + 75 + index * 40);
	// 		ctx.fillText(line, x + 170 + 30, y + 75 + index * 40);
	// 	});
	// }

	// {
	// 	let url = '/img/backgrounds/seniors/senior-navy-3240-1080.png';
	// 	if (match.detail?.kit !== 'MAIN') {
	// 		url = '/img/backgrounds/seniors/senior-pink-3240-1080.png';
	// 	}

	// 	const img = await getImageBitmap(url);
	// 	ctx.drawImage(img, 0, 0);
	// }

	// Team squad

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

	// const team = `${match.team?.club ?? ''} ${match.team?.squad ?? ''}`;

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

	// await drawSponsors(ctx);

	return (await canvasSplitter(canvas)).map(({ page, base64 }) => ({
		matchId,
		type,
		page,
		base64,
		createdAt: new Date().toISOString(),
	}));
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
