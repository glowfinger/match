import { Colours } from '$lib/Constants';
import type { Match, MatchImage } from '$lib/database/IndexedDB';
import { convertTime, matchDate } from '$lib/helpers/dateTime/ConvertTime';
import type { CanvasImage } from '$lib/types/Images';
import { KIT_VALUES } from '../constants/Colours';
import { UploadImageTypes } from '../constants/ImageKey';
import photoDrawer from '../drawers/PhotoDrawer';
import { drawSponsorsVertical } from '../drawers/SponsorsDrawer';
import canvasSplitter from './CanvasSplitter';

export const backgrounds = {
	[KIT_VALUES.MAIN]: Colours.NAVY,
	[KIT_VALUES.SECONDARY]: Colours.PINK,
};

export default async function matchRenderer(
	canvas: OffscreenCanvas | HTMLCanvasElement,
	match: Match,
	images: CanvasImage[] = [],
): Promise<Omit<MatchImage, 'id'>[]> {
	if (!canvas) {
		return [];
	}

	const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	if (!ctx) {
		return [];
	}

	ctx.fillStyle = backgrounds[match.detail?.kit ?? KIT_VALUES.MAIN];
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	const backgroundImage = images.find(getBackgroundImage);

	if (backgroundImage) {
		ctx.drawImage(backgroundImage.photo, 0, 0);
	}

	const mainImage = images.find(getMainImage);

	if (mainImage) {
		const destination = { width: 1080, height: 700, x: 0, y: 1350 - 700 };

		await photoDrawer(
			ctx,
			mainImage.photo,
			destination,
			{ width: mainImage.photo.width, height: mainImage.photo.height, x: 0, y: 0 },
			mainImage.settings.zoom,
			mainImage.settings.x,
			mainImage.settings.y,
		);
	}

	const cutoutBackgroundImage = images.find(getBackgroundCutoutImage);

	if (cutoutBackgroundImage) {
		ctx.drawImage(cutoutBackgroundImage.photo, 0, 0);
	}

	let y = 100;

	const centerX = canvas.width / 2;

	const title = ['Next', match.team?.squad ?? '', 'Match'].join(' ').trim();
	const size = 72;
	ctx.font = `${size}px black`;
	ctx.textAlign = 'center';
	ctx.fillStyle = Colours.WHITE;
	ctx.lineWidth = 12;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText(title, centerX, y);
	ctx.fillText(title, centerX, y);
	y += 20;

	if (match.schedule) {
		const y = 180;
		const date = matchDate(match.schedule.matchOn);
		ctx.font = `52px semiBold`;
		ctx.textAlign = 'center';
		ctx.lineWidth = 6;
		ctx.fillStyle = Colours.GOLD;
		ctx.strokeStyle = Colours.NAVY;
		ctx.strokeText(date, centerX, y);
		ctx.fillText(date, centerX, y);
	}

	if (match.schedule) {
		const y = 730;
		const times = `Meet: ${convertTime(match.schedule.meetAt ?? '')} - KO: ${convertTime(match.schedule.kickOffAt ?? '')}`;
		ctx.font = `36px semibold`;
		ctx.textAlign = 'center';
		ctx.lineWidth = 6;
		ctx.fillStyle = Colours.WHITE;
		ctx.strokeStyle = Colours.NAVY;
		ctx.strokeText(times, centerX, y);
		ctx.fillText(times, centerX, y);
	}

	if (match.detail) {
		const y = 780;
		ctx.font = `36px semibold`;
		ctx.textAlign = 'center';
		ctx.lineWidth = 6;
		ctx.fillStyle = Colours.WHITE;
		ctx.strokeStyle = Colours.NAVY;
		ctx.strokeText(match.detail.address, centerX, y);
		ctx.fillText(match.detail.address, centerX, y);
	}

	if (match.detail) {
		// Match type

		const y = 200;
		const size = 40;

		ctx.font = `${size}px semiBold`;
		ctx.textAlign = 'center';
		ctx.lineWidth = 8;
		ctx.fillStyle = Colours.WHITE;
		ctx.strokeStyle = Colours.NAVY;

		const lines = match.detail.type.split('\n');

		lines.forEach((line, index) => {
			const textX = centerX;
			const textY = y + index * size + size;
			ctx.strokeText(line, textX, textY);
			ctx.fillText(line, textX, textY);
		});
	}

	// {
	// 	const highlight = '💡 FRIDAY NIGHT LIGHTS 💡';
	// 	const size = 48;
	// 	ctx.font = `${size}px semibold`;
	// 	ctx.textAlign = 'center';
	// 	ctx.lineWidth = 6;
	// 	ctx.fillStyle = Colours.GOLD;
	// 	ctx.strokeStyle = Colours.NAVY;
	// 	ctx.strokeText(highlight, centerX, 640);
	// 	ctx.fillText(highlight, centerX, 640);
	// }

	const homeTeam = match.detail?.venue === 'HOME' ? match.team : match.opponent;
	const awayTeam = match.detail?.venue === 'HOME' ? match.opponent : match.team;

	if (homeTeam) {
		const x = centerX - 170 - 150;
		const y = 300;

		ctx.fillStyle = Colours.WHITE;
		ctx.lineWidth = 1;
		ctx.strokeStyle = Colours.BLACK;
		ctx.fillRect(x, y, 170, 170);
		ctx.strokeRect(x, y, 170, 170);

		const homeTeamImage = images.find(getHomeTeamImage);
		if (homeTeamImage) {
			ctx.drawImage(homeTeamImage.photo, x + 10, y + 10, 150, 150);
		}

		const lineHeight = 40;
		const lines = [homeTeam.club, homeTeam.squad];
		ctx.font = `${lineHeight}px regular`;
		ctx.textAlign = 'center';
		ctx.lineWidth = 6;
		ctx.fillStyle = Colours.WHITE;
		ctx.strokeStyle = Colours.NAVY;
		lines.forEach((line, index) => {
			const textX = x + 85;
			const textY = y + 210 + index * lineHeight + 10;
			ctx.strokeText(line, textX, textY);
			ctx.fillText(line, textX, textY);
		});
	}

	{
		const size = 80;
		ctx.font = `${size}px black`;
		ctx.textAlign = 'center';
		ctx.fillStyle = Colours.WHITE;
		ctx.lineWidth = 12;
		ctx.strokeStyle = Colours.NAVY;
		ctx.strokeText('vs', centerX, 300 + 115);
		ctx.fillText('vs', centerX, 300 + 115);
	}

	// Away team
	if (awayTeam) {
		const x = centerX + 150;
		const y = 300;

		ctx.fillStyle = Colours.WHITE;
		ctx.lineWidth = 1;
		ctx.strokeStyle = Colours.BLACK;
		ctx.fillRect(x, y, 170, 170);
		ctx.strokeRect(x, y, 170, 170);

		const awayTeamImage = images.find(getAwayTeamImage);
		if (awayTeamImage) {
			ctx.drawImage(awayTeamImage.photo, x + 10, y + 10, 150, 150);
		}

		const lineHeight = 40;
		const lines = [awayTeam.club, awayTeam.squad];
		ctx.font = `${lineHeight}px regular`;
		ctx.textAlign = 'center';
		ctx.lineWidth = 6;
		ctx.fillStyle = Colours.WHITE;
		ctx.strokeStyle = Colours.NAVY;
		lines.forEach((line, index) => {
			const textX = x + 85;
			const textY = y + 220 + index * (lineHeight + 12);
			ctx.strokeText(line, textX, textY);
			ctx.fillText(line, textX, textY);
		});
	}

	await drawSponsorsVertical(ctx, 1080 - 150 - 60, 1000, match, images);
	return (await canvasSplitter(canvas as OffscreenCanvas)).map(({ page, base64 }) => ({
		matchId: match.id,
		type: 'MATCH',
		page,
		base64,
		createdAt: new Date().toISOString(),
	}));
}

function getMainImage(image: CanvasImage): unknown {
	return image.uploadType === UploadImageTypes.UPLOAD && image.mediaType === 'MAIN';
}

function getBackgroundImage(image: CanvasImage): unknown {
	return image.uploadType === UploadImageTypes.BACKGROUND && image.mediaType === 'MATCH';
}

function getBackgroundCutoutImage(image: CanvasImage): unknown {
	return image.uploadType === UploadImageTypes.BACKGROUND_CUTOUT && image.mediaType === 'MATCH';
}

function getHomeTeamImage(image: CanvasImage): unknown {
	return image.uploadType === 'HOME' && image.mediaType === 'TEAM';
}

function getAwayTeamImage(image: CanvasImage): unknown {
	return image.uploadType === 'AWAY' && image.mediaType === 'TEAM';
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
