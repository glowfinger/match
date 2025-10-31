export type DestinationDimensions = { width: number; height: number; x: number; y: number };
export type ImageDimensions = { width: number; height: number; x: number; y: number };

const MIN_HORIZONTAL = -1;
const MAX_HORIZONTAL = 1;
const MIN_VERTICAL = -1;
const MAX_VERTICAL = 1;
const MIN_ZOOM = 1;
const MAX_ZOOM = 20;
// step constants are defined in UI; not used in drawer

export default async function photoDrawer(
	ctx: CanvasRenderingContext2D,
	photo: ImageBitmap,
	container: DestinationDimensions,
	image: ImageDimensions,
	zoom: number,
	horizontal: number,
	vertical: number,
): Promise<void> {
	const newSize = {
		width: 0,
		height: 0,
		x: container.x,
		y: container.y,
	};

	const containerRatio = container.width / container.height;
	const imageRatio = image.width / image.height;

	if (containerRatio > imageRatio) {
		newSize.width = container.width;
		newSize.height = container.width / imageRatio;
	} else {
		newSize.height = container.height;
		newSize.width = container.height * imageRatio;
	}

	// Base scale used to cover the container relative to source pixel dimensions
	const baseScale = Math.max(container.width / image.width, container.height / image.height);
	// If the image resolution is below the container (baseScale > 1), ignore additional zoom
	const effectiveZoom = baseScale > 1 ? 1 : Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM);
	const scaledWidth = newSize.width * effectiveZoom;
	const scaledHeight = newSize.height * effectiveZoom;

	// Clamp pan inputs to allowed range and convert to pixel offsets within bounds
	const clampedH = Math.min(Math.max(horizontal ?? 0, MIN_HORIZONTAL), MAX_HORIZONTAL);
	const clampedV = Math.min(Math.max(vertical ?? 0, MIN_VERTICAL), MAX_VERTICAL);

	const maxPanX = Math.max(0, (scaledWidth - container.width) / 2);
	const maxPanY = Math.max(0, (scaledHeight - container.height) / 2);

	const dx = container.x + (container.width - scaledWidth) / 2 + clampedH * maxPanX;
	const dy = container.y + (container.height - scaledHeight) / 2 + clampedV * maxPanY;

	// Draw the image centered (with optional zoom/pan) within the container
	ctx.save();
	ctx.beginPath();
	ctx.rect(container.x, container.y, container.width, container.height);
	ctx.clip();
	ctx.drawImage(photo, dx, dy, scaledWidth, scaledHeight);
	ctx.restore();
}
