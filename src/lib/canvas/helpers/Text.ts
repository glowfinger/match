export function splitText(
	ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
	text: string,
	maxWidth: number,
) {
	const lines = text.split('\n');
	const results = [];

	for (const line of lines) {
		const words = line.split(' ');

		let row = '';
		for (const word of words) {
			const testLine = row + word + ' ';
			const metrics = ctx.measureText(testLine);
			const lineWidth = metrics.width;
			if (lineWidth >= maxWidth) {
				results.push(row);
				row = word + ' ';
			} else {
				row += word + ' ';
			}
		}
		results.push(row);
	}

	return results;
}
