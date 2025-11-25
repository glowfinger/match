import { db, type ImageUpload } from '$lib/database/IndexedDB';

export async function getUploadByMatchAndTypes(
	matchId: number,
	mediaType: string,
	uploadType: string,
): Promise<ImageUpload | undefined> {
	const upload = await db.imageUploads.where({ matchId, mediaType, uploadType }).first();
	return upload ?? undefined;
}

export async function getUploadsByMatchAndMedia(
	matchId: number,
	mediaType: string,
): Promise<ImageUpload[]> {
	const uploads = await db.imageUploads.where({ matchId, mediaType }).toArray();
	return uploads;
}

export async function updateUpload(upload: ImageUpload): Promise<ImageUpload | undefined> {
	await db.imageUploads.put(upload);
	return getUploadByMatchAndTypes(upload.matchId, upload.mediaType, upload.uploadType);
}

export async function putUpload(
	upload: ImageUpload | Omit<ImageUpload, 'id'>,
): Promise<ImageUpload | undefined> {
	const { matchId, mediaType, uploadType } = upload;
	const found = await getUploadByMatchAndTypes(matchId, mediaType, uploadType);

	if (found?.id) {
		await db.imageUploads.update(found.id, { ...upload });
		return await db.imageUploads.get(found.id);
	}

	const id = await db.imageUploads.put(upload);
	return await db.imageUploads.get(id);
}

export async function updateUploadSettingsById(
	uploadId: number,
	settings: {
		zoom: number;
		x: number;
		y: number;
	},
): Promise<ImageUpload | undefined> {
	await db.imageUploads.update(uploadId, { settings: { ...settings } });
	return await db.imageUploads.get(uploadId);
}

export async function deleteUploadByMatchAndTypes(
	matchId: number,
	mediaType: string,
	uploadType: string,
): Promise<void> {
	await db.imageUploads.where({ matchId, mediaType, uploadType }).delete();
}

export async function deleteUploadByMatchAndMediaType(
	matchId: number,
	mediaType: string,
): Promise<void> {
	await db.imageUploads.where({ matchId, mediaType }).delete();
}

export async function hasUploadByMatchAndTypes(
	matchId: number,
	mediaType: string,
	uploadType: string,
): Promise<boolean> {
	const upload = await getUploadByMatchAndTypes(matchId, mediaType, uploadType);
	return upload !== undefined;
}

export async function hasUploadByMatchIdAndMediaType(
	matchId: number,
	mediaType: string,
): Promise<boolean> {
	const uploads = await getUploadsByMatchAndMedia(matchId, mediaType);
	return uploads.length > 0;
}
