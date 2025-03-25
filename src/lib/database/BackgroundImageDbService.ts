import { db, type BackgroundImage } from './IndexedDB';

export async function hasImagesByType(type: string): Promise<boolean> {
	return (await db.backgroundsImages.where({ type }).count()) > 0;
}

export async function getImagesByType(type: string): Promise<BackgroundImage[]> {
	return db.backgroundsImages.where({ type }).toArray();
}

export async function saveImages(images: BackgroundImage[]): Promise<void> {
	await db.backgroundsImages.bulkPut(images);
}

export async function removeImagesByType(type: string): Promise<void> {
	await db.backgroundsImages.where({ type }).delete();
}
