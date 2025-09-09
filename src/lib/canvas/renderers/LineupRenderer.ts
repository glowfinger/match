import { Colours } from '$lib/Constants';
import type { MatchImage } from '$lib/database/IndexedDB';
import { getMatchPositions } from '$lib/database/MatchPositionDBService';
import { getMatch } from '$lib/database/MatchService';
import { getMatchTags } from '$lib/database/MatchTagDBService';
import { getPlayersByKeys } from '$lib/database/PlayerDBService';
import { getStartingSelections } from '$lib/database/SelectionDBService';
import { matchDate } from '$lib/helpers/dateTime/ConvertTime';

import StarterPositons from '../constants/lineup/StarterPositons';
import headshotLoader from '../images/HeadshotLoader';
import canvasSplitter from './CanvasSplitter';

export default async function LineupRederer(
	matchId: number,
	type: string,
): Promise<Omit<MatchImage, 'id'>[]> {
	const PAGES = 4;
	const WIDTH = 1080;
	const HEIGHT = 1080;
	const canvas = new OffscreenCanvas(PAGES * WIDTH, HEIGHT);
	const ctx = canvas.getContext('2d', { willReadFrequently: true });
	if (!ctx) {
		throw new Error('Failed to get 2D context');
	}

	const match = await getMatch(matchId);
	const selections = await getStartingSelections(matchId);
	const positions = await getMatchPositions(matchId);
	const players = await getPlayersByKeys(selections.map((s) => s.playerKey));
	const debuts = (await getMatchTags(matchId, 'debut')).map((t) => t.playerKey);

	ctx.fillStyle = Colours.NAVY;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	drawTitle(ctx, 'FORWARDS', 1080 + 60, 160);
	drawTitle(ctx, 'BACKS', 1080 + 1080 + 60, 160);
	drawTitle(ctx, 'FINISHERS', 1080 + 1080 + 1080 + 60, 160);

	// aysnc loop
	for (const i of StarterPositons) {
		const position = positions.find((s) => s.position === i.number);

		if (!position) {
			continue;
		}

		const player = players.find((p) => p.key === position?.playerKey);

		if (!player) {
			continue;
		}

		const { x, y } = i;

		drawPlayerNumber(ctx, i.number, x + 100, y + 100);

		const image = await headshotLoader('away', player);
		if (image) {
			ctx.drawImage(image, x + 10, y, 240, 240);
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
			name = name + ' ' + player.bio.screen;
		} else {
			name = player.bio.screen;
		}

		ctx.fillText(name, x + 130, y + 260 - 10);
	}

	// Title
	ctx.font = `140px black`;
	ctx.textAlign = 'left';
	ctx.fillStyle = Colours.WHITE;
	ctx.lineWidth = 16;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText('LINEUP', 60, 160);
	ctx.fillText('LINEUP', 60, 160);

	// Team name
	// ctx.font = `80px black`;
	// ctx.textAlign = 'left';
	// ctx.lineWidth = 12;
	// ctx.strokeStyle = Colours.NAVY;
	// ctx.fillStyle = Colours.GOLD;
	// ctx.strokeText(teams.home.name, 60, 280);
	// ctx.fillText(teams.home.name, 60, 280);

	// VS
	ctx.font = `40px regular`;
	ctx.textAlign = 'left';
	ctx.lineWidth = 6;
	ctx.fillStyle = Colours.WHITE;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText('vs', 60, 360);
	ctx.fillText('vs', 60, 360);

	// Opposition team
	// ctx.font = `48px regular`;
	// ctx.textAlign = 'left';
	// ctx.lineWidth = 6;
	// ctx.fillStyle = Colours.WHITE;
	// ctx.strokeStyle = Colours.NAVY;
	// ctx.strokeText(teams.away.name, 120, 360);
	// ctx.fillText(teams.away.name, 120, 360);

	// Match type
	const MATCH_TYPE = match.detail?.type ?? '';
	ctx.font = `60px black`;
	ctx.textAlign = 'left';
	ctx.lineWidth = 6;
	ctx.fillStyle = Colours.WHITE;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText(MATCH_TYPE, 60, 440);
	ctx.fillText(MATCH_TYPE, 60, 440);

	// Date
	const date = matchDate(match.schedule?.matchOn ?? '');
	ctx.font = `36px regular`;
	ctx.textAlign = 'left';
	ctx.lineWidth = 6;
	ctx.fillStyle = Colours.WHITE;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText(date, 60, 540);
	ctx.fillText(date, 60, 540);

	// // Timings
	// const times = `Meet: ${convertTime(match.meetAt)} - KO: ${convertTime(match.kickOffAt)}`;
	// ctx.font = `36px regular`;
	// ctx.textAlign = 'left';
	// ctx.lineWidth = 6;
	// ctx.fillStyle = Colours.WHITE;
	// ctx.strokeStyle = Colours.NAVY;
	// ctx.strokeText(times, 60, 620);
	// ctx.fillText(times, 60, 620);

	// Address
	const ADDRESS = match.detail?.address ?? '';
	ctx.font = `36px regular`;
	ctx.textAlign = 'left';
	ctx.lineWidth = 6;
	ctx.fillStyle = Colours.WHITE;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText(ADDRESS, 60, 700);
	ctx.fillText(ADDRESS, 60, 700);

	// Footnote
	// ctx.font = `30px regular`;
	// ctx.textAlign = 'left';
	// ctx.lineWidth = 6;
	// ctx.fillStyle = Colours.GOLD;
	// ctx.strokeStyle = Colours.NAVY;
	// ctx.strokeText(footnote, 60, 880);
	// ctx.fillText(footnote, 60, 880);

	return (await canvasSplitter(canvas)).map(({ page, base64 }) => ({
		matchId,
		type,
		page,
		base64,
	}));
}

function drawTitle(ctx: OffscreenCanvasRenderingContext2D, title: string, x: number, y: number) {
	ctx.font = `140px black`;
	ctx.textAlign = 'left';
	ctx.fillStyle = Colours.WHITE;
	ctx.lineWidth = 16;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText(title, x, y);
	ctx.fillText(title, x, y);
}

export function drawPlayerNumber(
	ctx: OffscreenCanvasRenderingContext2D,
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
