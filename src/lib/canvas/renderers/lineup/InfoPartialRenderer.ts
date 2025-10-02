import { getImageBitmap } from '$lib/canvas/ImageCache';
import { Colours } from '$lib/Constants';
import { getMatch } from '$lib/database/MatchService';
import { convertTime, matchDate } from '$lib/helpers/dateTime/ConvertTime';

export default async function InfoPartialRenderer(
	ctx: OffscreenCanvasRenderingContext2D,
	matchId: number,
): Promise<void> {
	const match = await getMatch(matchId);

	let y = 160;

	if (match.team) {
		const title = ['LINEUP', match.team.squad].join(' ').trim();
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

	// Title

	// if (match.team && match.detail?.venue !== 'AWAY') {
	// 	// Team name
	// 	const size = 80;
	// 	const team = [match.team.club ?? '', match.team.squad ?? ''].join(' ').trim();
	// 	ctx.font = `${size}px black`;
	// 	ctx.textAlign = 'left';
	// 	ctx.lineWidth = 12;
	// 	ctx.strokeStyle = Colours.NAVY;
	// 	ctx.fillStyle = Colours.GOLD;
	// 	ctx.strokeText(team, 60, y + size);
	// 	ctx.fillText(team, 60, y + size);
	// 	y += size + 30;
	// }

	// if (match.opponent && match.detail?.venue === 'AWAY') {
	// 	const size = 48;
	// 	const opponent = [match.opponent.club ?? '', match.opponent.squad ?? '', 'vs'].join(' ').trim();
	// 	ctx.font = `${size}px regular`;
	// 	ctx.textAlign = 'left';
	// 	ctx.lineWidth = 6;
	// 	ctx.fillStyle = Colours.WHITE;
	// 	ctx.strokeStyle = Colours.NAVY;
	// 	ctx.strokeText(opponent, 60, y + size);
	// 	ctx.fillText(opponent, 60, y + size);
	// 	y += size + 30;
	// }

	// if (match.opponent && match.detail?.venue !== 'AWAY') {
	// 	const size = 48;
	// 	const opponent = ['vs', match.opponent.club ?? '', match.opponent.squad ?? ''].join(' ').trim();
	// 	// VS
	// 	ctx.font = `${size}px regular`;
	// 	ctx.textAlign = 'left';
	// 	ctx.lineWidth = 6;
	// 	ctx.fillStyle = Colours.WHITE;
	// 	ctx.strokeStyle = Colours.NAVY;
	// 	ctx.strokeText(opponent, 60, y + size);
	// 	ctx.fillText(opponent, 60, y + size);
	// 	y += size + 30;
	// }

	// if (match.team && match.detail?.venue === 'AWAY') {
	// 	// Team name
	// 	const size = 80;
	// 	const team = [match.team.club ?? '', match.team.squad ?? ''].join(' ').trim();
	// 	ctx.font = `${size}px black`;
	// 	ctx.textAlign = 'left';
	// 	ctx.lineWidth = 12;
	// 	ctx.strokeStyle = Colours.NAVY;
	// 	ctx.fillStyle = Colours.GOLD;
	// 	ctx.strokeText(team, 60, y + size);
	// 	ctx.fillText(team, 60, y + size);
	// 	y += size + 30;
	// }

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

	if (match.team && match.opponent) {
		const badge = match.detail?.venue === 'HOME' ? match.team.badge : match.opponent.badge;
		const name = match.detail?.venue === 'HOME' ? match.team.squad : match.opponent.squad;
		const x = 300;
		const size = 80;
		ctx.drawImage(await getImageBitmap(badge), x, y, 150, 150);
		ctx.font = `${size}px black`;
		ctx.textAlign = 'left';
		ctx.strokeText(name, x + 150, y + 150);
		ctx.fillText(name, x + 150, y + 150);
	}

	if (match.opponent && match.team) {
		const badge = match.detail?.venue === 'HOME' ? match.team.badge : match.opponent.badge;
		const name = match.detail?.venue === 'HOME' ? match.opponent.squad : match.team.squad;
		const x = 640;
		const size = 80;
		ctx.drawImage(await getImageBitmap(badge), x, y, 150, 150);
		ctx.font = `${size}px black`;
		ctx.textAlign = 'left';
		ctx.strokeText(name, x + 150, y + 150);
		ctx.fillText(name, x + 150, y + 150);
	}

	// const home: string = config.teams.home.name.toUpperCase() || '';
	// const away: string = config.teams.away.name.toUpperCase() || '';
	// writeTeamBadge(ctx, { x: 300, y: 400 }, config.teams.home.badge);
	// writeTeamName(ctx, { x: 375, y: 590 }, home, 'center');

	// writeTeamBadge(ctx, { x: 640, y: 400 }, config.teams.away.badge);
	// writeTeamName(ctx, { x: 715, y: 590 }, away, 'center');// if (match.schedule) {

	// }

	// Date
	if (match.schedule) {
		const size = 48;
		const margin = 20;
		const date = matchDate(match.schedule?.matchOn ?? '');
		ctx.font = `${size}px black`;
		ctx.textAlign = 'left';
		ctx.lineWidth = 6;
		ctx.fillStyle = Colours.WHITE;
		ctx.strokeStyle = Colours.NAVY;
		ctx.strokeText(date, 60, y);
		ctx.fillText(date, 60, y);
		y += margin;
	}

	// Timings;
	if (match.schedule) {
		const times = `Meet: ${convertTime(match.schedule?.meetAt ?? '')} - KO: ${convertTime(match.schedule?.kickOffAt ?? '')}`;
		const size = 36;
		const margin = 20;
		ctx.font = `${size}px regular`;
		ctx.textAlign = 'left';
		ctx.lineWidth = 6;
		ctx.fillStyle = Colours.WHITE;
		ctx.strokeStyle = Colours.NAVY;
		ctx.strokeText(times, 60, y + size);
		ctx.fillText(times, 60, y + size);
		y += size + margin;
	}

	// Address
	if (match.detail) {
		const size = 36;
		const margin = 20;
		const lines = match.detail.address.split('\n');
		ctx.font = `${size}px regular`;
		ctx.textAlign = 'left';
		ctx.lineWidth = 6;
		ctx.fillStyle = Colours.WHITE;
		ctx.strokeStyle = Colours.NAVY;
		lines.forEach((line, index) => {
			ctx.strokeText(line, 60, y + index * size + size);
			ctx.fillText(line, 60, y + index * size + size);
			y += 16;
		});
		y += size + margin;
	}

	// Footnote
	// ctx.font = `30px regular`;
	// ctx.textAlign = 'left';
	// ctx.lineWidth = 6;
	// ctx.fillStyle = Colours.GOLD;
	// ctx.strokeStyle = Colours.NAVY;
	// ctx.strokeText(footnote, 60, 880);
	// ctx.fillText(footnote, 60, 880);

	// Badges
	// badgeImages.reverse().forEach((img, i) => {
	//   const x = 880 - i * 140;
	//   const y = 60;

	//   ctx.drawImage(img, x, y, 140, 140);
	// });
}
