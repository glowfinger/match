export default async function canvasSplitter(
	source: OffscreenCanvas | HTMLCanvasElement,
): Promise<{ page: number; base64: string }[]> {
	const canvas = new OffscreenCanvas(1080, 1350);

	const ctx = canvas.getContext('2d');
	if (!ctx) {
		throw new Error('Failed to get 2D context for temp canvas');
	}
	const sourceCtx = source.getContext('2d');
	if (!sourceCtx) {
		throw new Error('Failed to get 2D context for source canvas');
	}

	const images: { page: number; base64: string }[] = [];

	let xPostion = 0;
	while (xPostion < source.width) {
		const imageData = sourceCtx.getImageData(xPostion, 0, 1080, 1350);
		ctx.putImageData(imageData, 0, 0);

		const blob = await canvas.convertToBlob({ type: 'image/png' });
		const base64 = await blobToData(blob);

		images.push({
			page: 1 + xPostion / 1080,
			base64: base64 as string,
		});

		xPostion += 1080;
	}

	return images;
}

export async function blobToData(blob: Blob) {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result);
		reader.readAsDataURL(blob);
	});
}
