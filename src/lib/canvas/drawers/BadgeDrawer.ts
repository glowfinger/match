import { Colours } from '$lib/Constants';
import type { Match } from '$lib/database/IndexedDB';
import type { CanvasImage } from '$lib/types/Images';

export async function drawBadges(
	ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
	match: Match,
	x: number = 60,
	y: number = 460,
	images: CanvasImage[] = [],
) {
	const homeTeam = match.detail?.venue === 'HOME' ? match.team : match.opponent;
	const awayTeam = match.detail?.venue === 'HOME' ? match.opponent : match.team;

	if (homeTeam) {
		const lineHeight = 54;
		ctx.fillStyle = Colours.WHITE;
		ctx.lineWidth = 2;
		ctx.strokeStyle = Colours.NAVY;
		ctx.fillRect(x, y, 170, 170);
		ctx.strokeRect(x, y, 170, 170);

		const homeTeamImage = images.find(
			(image) => image.uploadType === 'HOME' && image.mediaType === 'TEAM',
		);
		if (homeTeamImage) {
			ctx.drawImage(homeTeamImage.photo, x + 10, y + 10);
		}

		const title = [homeTeam.club, homeTeam.squad].join(' ').trim();

		const lines = [title];
		ctx.font = `${lineHeight}px semiBold`;
		ctx.textAlign = 'left';
		ctx.lineWidth = 8;
		ctx.fillStyle = Colours.WHITE;
		ctx.strokeStyle = Colours.NAVY;
		lines.forEach((line, index) => {
			ctx.strokeText(line, x + 170 + 30, y + 95 + index * lineHeight + 10);
			ctx.fillText(line, x + 170 + 30, y + 95 + index * lineHeight + 10);
		});
	}

	// Away team
	if (awayTeam) {
		const x1 = x;
		const y1 = y + 200;
		const lineHeight = 54;

		ctx.fillStyle = Colours.WHITE;
		ctx.lineWidth = 2;
		ctx.strokeStyle = Colours.NAVY;
		ctx.fillRect(x1, y1, 170, 170);
		ctx.strokeRect(x1, y1, 170, 170);

		const awayTeamImage = images.find(
			(image) => image.uploadType === 'AWAY' && image.mediaType === 'TEAM',
		);
		if (awayTeamImage) {
			ctx.drawImage(awayTeamImage.photo, x1 + 10, y1 + 10);
		}

		const lines = [[awayTeam.club, awayTeam.squad].join(' ')];
		ctx.font = `${lineHeight}px semiBold`;
		ctx.textAlign = 'left';
		ctx.lineWidth = 8;
		ctx.fillStyle = Colours.WHITE;
		ctx.strokeStyle = Colours.NAVY;
		lines.forEach((line, index) => {
			ctx.strokeText(line, x1 + 170 + 30, y1 + 95 + index * 40);
			ctx.fillText(line, x1 + 170 + 30, y1 + 95 + index * 40);
		});
	}
}
