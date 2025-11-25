export type CanvasImage = {
	photo: ImageBitmap;
	uploadType: string;
	mediaType: string;
	settings: {
		x: number;
		y: number;
		zoom: number;
	};
};
