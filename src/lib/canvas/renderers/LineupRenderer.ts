import { Colours } from '$lib/Constants';
import type { MatchImage } from '$lib/database/IndexedDB';
import { getMatchPositions } from '$lib/database/MatchPositionDBService';
import { getMatchRolesByType } from '$lib/database/MatchRoleDBService';
import { getMatch } from '$lib/database/MatchService';
import { getMatchTags } from '$lib/database/MatchTagDBService';
import { getPlayersByKeys } from '$lib/database/PlayerDBService';
import { getYesSelectionsByMatchId } from '$lib/database/SelectionDBService';
import type { CanvasImage } from '$lib/types/Images';
import { KIT_BACKGROUND, KIT_VALUES } from '../constants/Colours';
import StarterPositons from '../constants/lineup/StarterPositons';
import { drawBadges } from '../drawers/BadgeDrawer';
import photoDrawer from '../drawers/PhotoDrawer';
import { drawSponsors, drawSponsorsVertical } from '../drawers/SponsorsDrawer';
import { drawSmallTitle, drawVersusTitle } from '../TextDrawer';
import canvasSplitter from './CanvasSplitter';
import finisherListPartialRenderer from './lineup/FinisherListPartialRenderer';
import InfoPartialRenderer from './lineup/InfoPartialRenderer';

export default async function LineupRenderer(
	canvas: HTMLCanvasElement | OffscreenCanvas,
	matchId: number,
	images: CanvasImage[] = [],
): Promise<Omit<MatchImage, 'id'>[]> {
	if (!canvas) {
		return [];
	}

	const ctx = canvas.getContext('2d', { willReadFrequently: true });
	if (!ctx) {
		throw new Error('Failed to get 2D context');
	}

	const match = await getMatch(matchId);
	const selections = await getYesSelectionsByMatchId(matchId);
	const positions = await getMatchPositions(matchId);
	const players = await getPlayersByKeys(selections.map((s) => s.playerKey));
	const debuts = (await getMatchTags(matchId, 'debut')).map((t) => t.playerKey);
	const leadershipRoles = await getMatchRolesByType(matchId, 'leadership');

	if (match.detail) {
		ctx.fillStyle = KIT_BACKGROUND[match.detail?.kit ?? KIT_VALUES.MAIN];
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	} else {
		ctx.fillStyle = Colours.WHITE;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	const backgroundImage = images.find((image) => image.uploadType === 'BACKGROUND');
	if (backgroundImage) {
		ctx.drawImage(backgroundImage.photo, 0, 0);
	}

	const mainImage = images.find(
		(image) => image.uploadType === 'UPLOAD' && image.mediaType === 'MAIN',
	);

	if (mainImage) {
		const destination = { width: 1080, height: 1350, x: 0, y: 0 };
		await photoDrawer(
			ctx as CanvasRenderingContext2D,
			mainImage.photo,
			destination,
			{ width: mainImage.photo.width, height: mainImage.photo.height, x: 0, y: 0 },
			mainImage.settings.zoom,
			mainImage.settings.x,
			mainImage.settings.y,
		);
	}

	const backgroundCutoutImage = images.find((image) => image.uploadType === 'BACKGROUND_CUTOUT');
	if (backgroundCutoutImage) {
		ctx.drawImage(backgroundCutoutImage.photo, 0, 0);
	}

	await InfoPartialRenderer(ctx, matchId);

	drawSmallTitle(ctx, 'FORWARDS', 1080 + 60, 120);
	drawVersusTitle(ctx, `vs ${match.opponent?.club ?? ''}`, 1080 + 60, 180);
	drawSmallTitle(ctx, 'BACKS', 1080 + 1080 + 60, 120);
	drawVersusTitle(ctx, `vs ${match.opponent?.club ?? ''}`, 1080 + 1080 + 60, 180);

	// // // aysnc loop
	for (const i of StarterPositons) {
		const position = positions.find((s) => s.position === i.number);
		if (!position) {
			continue;
		}

		const player = players.find((p) => p.key === position?.playerKey);

		if (!player) {
			continue;
		}

		let x = i.x;
		const y = i.y;
		if (['1', '2', '3', '4', '5', '6', '7', '8'].includes(i.number)) {
			x = x + 1080;
		}

		if (['9', '10', '11', '12', '13', '14', '15'].includes(i.number)) {
			x = x + 1080 + 1080;
		}

		drawPlayerNumber(ctx, i.number, x + 100, y + 100);

		// const image = await headshotLoader(match.detail?.kit ?? 'MAIN', player);
		// if (image) {
		// 	ctx.drawImage(image, x + 10, y, 240, 240);
		// }

		const positionImage = images.find(
			(image) => image.uploadType === position.position && image.mediaType === 'POSITION',
		);
		if (positionImage) {
			ctx.drawImage(positionImage.photo, x + 10, y, 240, 240);
		}

		ctx.fillStyle = 'white';
		ctx.fillRect(x, y + 260 - 40, 260, 40);

		ctx.strokeStyle = Colours.NAVY;
		ctx.lineWidth = 3;
		ctx.strokeRect(x, y + 260 - 40, 260, 40);

		ctx.font = `24px semiBold`;
		ctx.textAlign = 'center';
		ctx.fillStyle = 'black';

		let name = '';

		if (player.tags.homegrown) {
			name = '🍟' + name;
		}

		if (debuts.includes(player.key)) {
			name = '📣' + name;
		}

		if (name.length > 0) {
			name = name + ' ' + player.bio.last;
		} else {
			name = player.bio.last;
		}

		// TODO unnest the ifs

		const leadershipRole = leadershipRoles.find((r) => r.playerKey === player.key);
		if (leadershipRole?.role === 'captain') {
			name += ` (C)`;
		} else if (leadershipRole?.role === 'vice-captain') {
			name += ` (VC)`;
		} else if (leadershipRole?.role === 'pack-leader') {
			name += ` (PL)`;
		}

		ctx.fillText(name, x + 130, y + 260 - 10);
	}

	await drawBadges(ctx, match, 60, 460, images as CanvasImage[]);

	// Finishers
	// await FinishersPartialRenderer(ctx, matchId);

	await finisherListPartialRenderer(ctx, matchId);

	const legend = ' 🍟 Home Grown  |  📣 Debut';
	// const legend = '🍟 Home Grown';
	ctx.font = `30px regular`;
	ctx.textAlign = 'right';
	ctx.lineWidth = 6;
	ctx.fillStyle = Colours.WHITE;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText(legend, 1080 * 2 - 60, 1280);
	ctx.fillText(legend, 1080 * 2 - 60, 1280);
	ctx.strokeText(legend, 1080 * 3 - 60, 1280);
	ctx.fillText(legend, 1080 * 3 - 60, 1280);
	ctx.strokeText(legend, 1080 * 4 - 60, 1280);
	ctx.fillText(legend, 1080 * 4 - 60, 1280);

	// draw sponsors on each page
	for (const page of [1, 2, 3]) {
		await drawSponsors(ctx, 60 + (page - 1) * 1080, 1120);
	}

	await drawSponsorsVertical(ctx, 1080 * 4 - 60 - 160, 60);

	return (await canvasSplitter(canvas as OffscreenCanvas)).map(({ page, base64 }) => ({
		matchId,
		type: 'LINEUP',
		page,
		base64,
		createdAt: new Date().toISOString(),
	}));
}

export function drawPlayerNumber(
	ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
	number: string,
	x: number,
	y: number,
): void {
	ctx.font = `140px black`;
	ctx.textAlign = 'right';

	ctx.fillStyle = Colours.WHITE;
	ctx.fillText(number, x, y);

	ctx.lineWidth = 6;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText(number, x, y);
}
