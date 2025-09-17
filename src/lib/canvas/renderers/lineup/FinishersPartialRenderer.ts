import { drawTitle, drawVersusTitle } from '$lib/canvas/TextDrawer';
import { Colours } from '$lib/Constants';
import { getMatchPositions } from '$lib/database/MatchPositionDBService';
import { getMatch } from '$lib/database/MatchService';
import { getPlayersByKeys } from '$lib/database/PlayerDBService';
import { getYesSelectionsByMatchId } from '$lib/database/SelectionDBService';

const TITLE = 'FINISHERS';

export default async function finishersPartialRenderer(
	ctx: OffscreenCanvasRenderingContext2D,
	matchId: number,
): Promise<void> {
	// TODO bring this from config
	const kit = 'away';
	const order = [0, 1, 2]; // TODO bring this from image config

	const match = await getMatch(matchId);

	const selections = await getYesSelectionsByMatchId(matchId);
	const positions = (await getMatchPositions(matchId)).map((p) => p.playerKey);
	// const players = await getPlayersByKeys(selections.map((s) => s.playerKey));

	const finishers = selections.filter(({ playerKey }) => !positions.includes(playerKey));
	const players = await getPlayersByKeys(finishers.map((s) => s.playerKey));

	console.log(players.length);
	// const finishers = selections.filter(({ playerKey }) =>
	// 	positions.some((p) => p.playerKey === playerKey),
	// );

	// console.log(finishers);

	const x = 1080 + 1080 + 1080 + 60;
	drawTitle(ctx, TITLE, x, 160);
	drawVersusTitle(ctx, `vs ${match.opponent?.club ?? ''}`, x, 250);

	// Sponsors

	const coords = [
		{ x: 1080 * 3 + 60, y: 920 - 350 },
		{ x: 1080 * 3 + 430, y: 920 - 350 },
		{ x: 1080 * 3 + 780, y: 920 - 350 },
	];

	const imagetypes = ['profile-left', 'profile-front', 'profile-right'];

	players.forEach(async (player, i) => {
		const { x, y } = coords[i];
		const imagetype = imagetypes[i];

		if (!player) {
			return;
		}

		const url = player.images.find((i) => i.type === imagetype)?.large;

		console.log(url);

		console.log(
			player.bio.first,
			player.bio.last,
			imagetype,
			url,
			player.images.map((i) => [i.type, i.kit]),
		);

		if (url) {
			const image = await fetch(url)
				.then((response) => response.blob())
				.then(async (blob) => await createImageBitmap(blob));

			ctx.drawImage(image, x - image.width / 2, y - 500, image.width * 0.5, image.height * 0.5);
		}

		// 	const img = finisherImages.find((p) => p.key === player.key);
		// 	if (img && i === 1) {
		// 		const ratio = 700 / img.photo.height;
		// 		const x_offset = (img.photo.width * ratio) / 2;
		// 		ctx.drawImage(
		// 			img.photo,
		// 			x - x_offset / 2,
		// 			y - 500,
		// 			img.photo.width * ratio,
		// 			img.photo.height * ratio,
		// 		);
		// 	}
		// });
		// list.forEach((player, i) => {
		// 	const { x, y } = coords[i];
		// 	if (!player) {
		// 		return;
		// 	}
		// 	const img = finisherImages.find((p) => p.key === player.key);
		// 	if (img && i !== 1) {
		// 		const ratio = 700 / img.photo.height;
		// 		const x_offset = (img.photo.width * ratio) / 2;
		// 		ctx.drawImage(
		// 			img.photo,
		// 			x - x_offset / 2,
		// 			y - 500,
		// 			img.photo.width * ratio,
		// 			img.photo.height * ratio,
		// 		);
		// 	}
	});
	players.forEach((player, i) => {
		const { x, y } = coords[i];
		if (!player) {
			return;
		}
		ctx.fillStyle = 'white';
		ctx.fillRect(x, y, 260, 40);
		ctx.strokeStyle = Colours.NAVY;
		ctx.lineWidth = 3;
		ctx.strokeRect(x, y, 260, 40);
		let name = '';
		if (player.tags.homegrown) {
			name = '🍟' + name;
		}
		// 	if (debutants.includes(player.key)) {
		// 		name = '📣' + name;
		// 	}
		if (name.length > 0) {
			name = name + ' ' + player.bio.screen;
		} else {
			name = player.bio.screen;
		}
		// 	const role = roles.find((r) => r.key === player.key);
		// 	if (role) {
		// 		name += ` (${role.role})`;
		// 	}
		ctx.font = `24px semiBold`;
		ctx.textAlign = 'center';
		ctx.fillStyle = 'black';
		ctx.fillText(name, x + 130, y + 30);
		// });
		// const legend = '🍟 Home Grown';
		// // const legend = '🍟 Home Grown';
		// ctx.font = `24px regular`;
		// ctx.textAlign = 'left';
		// ctx.lineWidth = 4;
		// ctx.fillStyle = Colours.WHITE;
		// ctx.strokeStyle = Colours.NAVY;
		// ctx.strokeText(legend, 40, 1040);
		// ctx.fillText(legend, 40, 1040);
		// // Badges
		// badgeImages.forEach((img, i) => {
		// 	if (i === 0) {
		// 		ctx.drawImage(img, 900, 40, 140, 140);
		// 	}
	});
}
