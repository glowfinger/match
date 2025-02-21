import { Colours } from '$lib/Constants';
import type { Match, MatchImage } from '$lib/database/IndexedDB';

export default async function matchRenderer(
	match: Match,
	type: string,
): Promise<Omit<MatchImage, 'id'>[]> {
	const canvas = new OffscreenCanvas(1080 + 1080, 1080);
	const ctx = canvas.getContext('2d', { willReadFrequently: true });
	if (!ctx) {
		throw new Error('Failed to get 2D context');
	}

	ctx.fillStyle = Colours.NAVY;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Title
	ctx.font = `140px black`;
	ctx.textAlign = 'left';
	ctx.fillStyle = Colours.WHITE;
	ctx.lineWidth = 16;
	ctx.strokeStyle = Colours.NAVY;
	ctx.strokeText('NEXT MATCH', 60, 160);
	ctx.fillText('NEXT MATCH', 60, 160);

	const img = await fetch(
		'https://glowfinger.blob.core.windows.net/smg/background-removed/DSC03123.png',
	)
		.then((response) => response.blob())
		.then(async (blob) => await createImageBitmap(blob));

	ctx.drawImage(img, 500, 280, 1000, 800);

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

	const tempCanvas = new OffscreenCanvas(1080, 1080);
	const tempCtx = tempCanvas.getContext('2d');
	if (!tempCtx) {
		throw new Error('Failed to get 2D context for temp canvas');
	}

	const images: Omit<MatchImage, 'id'>[] = [];

	let xPostion = 0;
	while (xPostion < canvas.width) {
		const imageData = ctx.getImageData(xPostion, 0, 1080, 1080);
		tempCtx.putImageData(imageData, 0, 0);

		const blob = await tempCanvas.convertToBlob({ type: 'image/png' });
		const base64 = await blobToData(blob);

		images.push({
			matchId: match.id,
			type: type,
			page: 1 + xPostion / 1080,
			base64: base64 as string,
		});

		xPostion += 1080;
	}

	return images;
}

async function blobToData(blob: Blob) {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result);
		reader.readAsDataURL(blob);
	});
}
