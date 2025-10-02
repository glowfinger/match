import { db, type ImageFile } from '../IndexedDB';

export async function addImageFile(image: ImageFile): Promise<void> {
	await db.imageFiles.add(image);
}

export async function getImageFile(
	url: string,
): Promise<[string, undefined] | [undefined, ImageFile]> {
	const image = await db.imageFiles.where({ url }).first();

	if (image === undefined) {
		return ['Not found', undefined];
	}

	return [undefined, image];
}

export async function getImageFiles(): Promise<ImageFile[]> {
	return await db.imageFiles.toArray();
}

export async function deleteImageFile(url: string): Promise<void> {
	await db.imageFiles.delete(url);
}

export async function deleteImageFiles(): Promise<void> {
	await db.imageFiles.clear();
}

export async function getImageFileCount(): Promise<number> {
	return await db.imageFiles.count();
}

export async function getImageFileSize(): Promise<number> {
	return await db.imageFiles
		.toArray()
		.then((images) => images.reduce((acc, image) => acc + image.blob.size, 0));
}
