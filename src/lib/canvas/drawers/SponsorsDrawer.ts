import { Colours, SPONSORS, type Sponsor } from '$lib/Constants';
import { getImageBitmap } from '../ImageCache';

export async function drawSponsorsVertical(
	ctx: OffscreenCanvasRenderingContext2D,
	x: number = 60,
	y: number = 60,
) {
	const sponsors = SPONSORS.filter((sponsor) => sponsor.sections.includes('SENIOR')).toSorted(
		(a) => (a.level === '1' ? -1 : 1),
	);

	let yOffset = 0 - 20;

	for (const [, sponsor] of sponsors.entries()) {
		if (sponsor.level === '1') {
			const imageWidth = 150;
			const imageBorder = 10;
			const drawX = x;
			const drawY = y + yOffset;
			ctx.lineWidth = 2;
			ctx.strokeStyle = Colours.BLACK;
			ctx.fillStyle = Colours.WHITE;
			ctx.fillRect(drawX, drawY, imageWidth + imageBorder * 2, imageWidth + imageBorder * 2);
			ctx.strokeRect(drawX, drawY, imageWidth + imageBorder * 2, imageWidth + imageBorder * 2);
			const img = await getImageBitmap(sponsor.logo);
			ctx.drawImage(img, drawX + imageBorder, drawY + imageBorder);
			yOffset = imageWidth + imageBorder * 2 + 20;
		}

		if (sponsor.level === '2') {
			const imageWidth = 150;
			const imageHeight = 70;
			const imageBorder = 10;
			const drawX = x;
			const drawY = y + yOffset;
			ctx.lineWidth = 2;
			ctx.strokeStyle = Colours.BLACK;
			ctx.fillStyle = Colours.WHITE;
			ctx.fillRect(drawX, drawY, imageWidth + imageBorder * 2, imageHeight + imageBorder * 2);
			ctx.strokeRect(drawX, drawY, imageWidth + imageBorder * 2, imageHeight + imageBorder * 2);
			const img = await getImageBitmap(sponsor.logo);
			ctx.drawImage(img, drawX + imageBorder, drawY + imageBorder);
			yOffset = imageHeight + imageBorder * 2 + 20;
		}
	}
}

export async function drawSponsors(
	ctx: OffscreenCanvasRenderingContext2D,
	x: number = 60,
	y: number = 1120,
) {
	const sponsors = SPONSORS.filter((sponsor) => sponsor.sections.includes('SENIOR')).toSorted(
		(a) => (a.level === '1' ? -1 : 1),
	);

	for (const [index, sponsor] of sponsors.entries()) {
		await drawSponsor(ctx, sponsor, index, x, y);
	}
}

export async function drawSponsor(
	ctx: OffscreenCanvasRenderingContext2D,
	sponsor: Sponsor,
	index: number,
	x: number,
	y: number,
) {
	if (sponsor.level === '1') {
		const imageWidth = 150;
		const imageBorder = 10;
		const drawX = x + imageWidth * index;
		const drawY = y;
		ctx.lineWidth = 2;
		ctx.strokeStyle = Colours.BLACK;
		ctx.fillStyle = Colours.WHITE;
		ctx.fillRect(drawX, drawY, imageWidth + imageBorder * 2, imageWidth + imageBorder * 2);
		ctx.strokeRect(drawX, drawY, imageWidth + imageBorder * 2, imageWidth + imageBorder * 2);
		const img = await getImageBitmap(sponsor.logo);
		ctx.drawImage(img, drawX + imageBorder, drawY + imageBorder);
	}

	if (sponsor.level === '2') {
		const imageWidth = 150;
		const imageHeight = 70;
		const imageBorder = 10;
		const drawX = x + imageWidth * index + 40 * index;
		const drawY = y + 80;
		ctx.lineWidth = 1;
		ctx.strokeStyle = Colours.BLACK;
		ctx.fillStyle = Colours.WHITE;
		ctx.fillRect(drawX, drawY, imageWidth + imageBorder * 2, imageHeight + imageBorder * 2);
		ctx.strokeRect(drawX, drawY, imageWidth + imageBorder * 2, imageHeight + imageBorder * 2);
		const img = await getImageBitmap(sponsor.logo);
		ctx.drawImage(img, drawX + imageBorder, drawY + imageBorder);
	}
}
