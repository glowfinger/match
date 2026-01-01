import headshotLoader from '$lib/canvas/images/HeadshotLoader';
import { drawSmallTitle, drawVersusTitle } from '$lib/canvas/TextDrawer';
import { Colours } from '$lib/Constants';
import { getMatchPositions } from '$lib/database/MatchPositionDBService';
import { getMatchRolesByType } from '$lib/database/MatchRoleDBService';
import { getMatch } from '$lib/database/MatchService';
import { getMatchTags } from '$lib/database/MatchTagDBService';
import { getPlayersByKeys } from '$lib/database/PlayerDBService';
import { getYesSelectionsByMatchId } from '$lib/database/SelectionDBService';

const TITLE = 'FINISHERS';

const ROW_Y1 = 220;
const ROW_Y2 = ROW_Y1 + 300;
const ROW_Y3 = ROW_Y2 + 300;

const PAGE_WIDTH = 0;

const COLUMN_X1 = PAGE_WIDTH + 60;
const COLUMN_X2 = PAGE_WIDTH + 160 + 60 + 15;
const COLUMN_X3 = PAGE_WIDTH + 320 + 90;
const COLUMN_X4 = PAGE_WIDTH + 480 + 90 + 15;
const COLUMN_X5 = PAGE_WIDTH + 640 + 60 + 60;

const COORDS = [
	{ x: COLUMN_X2, y: ROW_Y1 },
	{ x: COLUMN_X4, y: ROW_Y1 },
	{ x: COLUMN_X4, y: ROW_Y2 },
	{ x: COLUMN_X2, y: ROW_Y2 },
];

export default async function finisherListPartialRenderer(
	ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
	matchId: number,
): Promise<void> {
	const match = await getMatch(matchId);

	const selections = await getYesSelectionsByMatchId(matchId);
	const positions = (await getMatchPositions(matchId)).map((p) => p.playerKey);

	const finishers = selections.filter(({ playerKey }) => !positions.includes(playerKey));
	const players = await getPlayersByKeys(finishers.map((s) => s.playerKey));

	const debuts = (await getMatchTags(matchId, 'debut')).map((t) => t.playerKey);
	const leadershipRoles = await getMatchRolesByType(matchId, 'leadership');

	// {
	// 	const img = await getImageBitmap('/img/photos/stollery-hickson.png');
	// 	ctx.drawImage(img, 1080 * 3, 0);
	// }

	const x = 1080 + 1080 + 1080 + 60;
	drawSmallTitle(ctx, TITLE, x, 120);
	drawVersusTitle(ctx, `vs ${match.opponent?.club ?? ''}`, x, 180);

	const coords = players.length == 2 ? [COORDS[0], COORDS[2]] : COORDS;
	console.log(coords);
	for (const [i, coord] of coords.entries()) {
		const player = players[i];
		if (!player) {
			continue;
		}

		const x = coord.x + 1080 * 3;

		const y = coord.y + 300;

		const image = await headshotLoader(match.detail?.kit ?? 'MAIN', player);
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
}
