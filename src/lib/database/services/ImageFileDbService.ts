import { db, type ImageFile } from '../IndexedDB';

export async function addImageFile(image: ImageFile): Promise<void> {
	await db.imageFiles.add(image);
}

export async function getImageFile(url: string): Promise<ImageFile> {
	const image = await db.imageFiles.where({ url }).first();
	if (image) {
		return image;
	}
	throw new Error('Image file not found');
}

export async function getImageFiles(): Promise<ImageFile[]> {
	return await db.imageFiles.toArray();
}
