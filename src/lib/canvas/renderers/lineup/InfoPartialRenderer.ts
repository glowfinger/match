import { Colours } from '$lib/Constants';
import { getMatch } from '$lib/database/MatchService';
import { convertTime, matchDate } from '$lib/helpers/dateTime/ConvertTime';

export default async function InfoPartialRenderer(
	ctx: OffscreenCanvasRenderingContext2D,
	matchId: number,
): Promise<void> {
	const match = await getMatch(matchId);

	// Title
	ctx.font = `140px black`;
	ctx.textAlign = 'left';
	ctx.fillStyle = Colours.WHITE;
	ctx.lineWidth = 16;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText('LINEUP', 60, 160);
	ctx.fillText('LINEUP', 60, 160);

	// Team name
	ctx.font = `80px black`;
	ctx.textAlign = 'left';
	ctx.lineWidth = 12;
	ctx.strokeStyle = Colours.NAVY;
	ctx.fillStyle = Colours.GOLD;
	ctx.strokeText(match.team?.club ?? '', 60, 280);
	ctx.fillText(match.team?.club ?? '', 60, 280);

	// VS
	ctx.font = `40px regular`;
	ctx.textAlign = 'left';
	ctx.lineWidth = 6;
	ctx.fillStyle = Colours.WHITE;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText('vs', 60, 360);
	ctx.fillText('vs', 60, 360);

	// Opposition team
	ctx.font = `48px regular`;
	ctx.textAlign = 'left';
	ctx.lineWidth = 6;
	ctx.fillStyle = Colours.WHITE;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText(match.opponent?.club ?? '', 120, 360);
	ctx.fillText(match.opponent?.club ?? '', 120, 360);

	// Match type
	ctx.font = `60px black`;
	ctx.textAlign = 'left';
	ctx.lineWidth = 6;
	ctx.fillStyle = Colours.WHITE;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText(match.detail?.type ?? '', 60, 440);
	ctx.fillText(match.detail?.type ?? '', 60, 440);

	// Date
	const date = matchDate(match.schedule?.matchOn ?? '');
	ctx.font = `36px regular`;
	ctx.textAlign = 'left';
	ctx.lineWidth = 6;
	ctx.fillStyle = Colours.WHITE;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText(date, 60, 540);
	ctx.fillText(date, 60, 540);

	// Timings
	const times = `Meet: ${convertTime(match.schedule?.meetAt ?? '')} - KO: ${convertTime(match.schedule?.kickOffAt ?? '')}`;
	ctx.font = `36px regular`;
	ctx.textAlign = 'left';
	ctx.lineWidth = 6;
	ctx.fillStyle = Colours.WHITE;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText(times, 60, 620);
	ctx.fillText(times, 60, 620);

	// Address
	ctx.font = `36px regular`;
	ctx.textAlign = 'left';
	ctx.lineWidth = 6;
	ctx.fillStyle = Colours.WHITE;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText(match.detail?.address ?? '', 60, 700);
	ctx.fillText(match.detail?.address ?? '', 60, 700);

	const back = await fetch('/img/photos/DSC03233.png')
		.then((response) => response.blob())
		.then(async (blob) => await createImageBitmap(blob));

	ctx.drawImage(back, 0, 1000);

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
