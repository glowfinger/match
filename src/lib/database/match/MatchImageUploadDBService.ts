import { db, type MatchImageUploads } from '$lib/database/IndexedDB';

export async function getUploadByMatchAndTypes(
	matchId: number,
	matchImageType: string,
	uploadedImageType: string,
): Promise<MatchImageUploads | undefined> {
	const upload = await db.matchImageUploads
		.where({ matchId, matchImageType, uploadedImageType })
		.first();
	return upload ?? undefined;
}

export async function deleteUploadByMatch(
	matchId: number,
	matchImageType: string,
	uploadedImageType: string,
): Promise<void> {
	await db.matchImageUploads.where({ matchId, matchImageType, uploadedImageType }).delete();
}

export async function createUpload(
	upload: Omit<MatchImageUploads, 'id'>,
): Promise<MatchImageUploads | undefined> {
	const existingUpload = await getUploadByMatchAndTypes(
		upload.matchId,
		upload.matchImageType,
		upload.uploadedImageType,
	);
	if (existingUpload) {
		await deleteUploadByMatch(upload.matchId, upload.matchImageType, upload.uploadedImageType);
	}
	await db.matchImageUploads.put(upload);
	return getUploadByMatchAndTypes(upload.matchId, upload.matchImageType, upload.uploadedImageType);
}

export async function updateUpload(
	upload: MatchImageUploads,
): Promise<MatchImageUploads | undefined> {
	await db.matchImageUploads.put(upload);
	return getUploadByMatchAndTypes(upload.matchId, upload.matchImageType, upload.uploadedImageType);
}

export async function updateUploadSettingsById(
	uploadId: number,
	settings: {
		zoom: number;
		x: number;
		y: number;
		page: number;
	},
): Promise<MatchImageUploads | undefined> {
	await db.matchImageUploads.update(uploadId, { settings: { ...settings } });
	return await db.matchImageUploads.get(uploadId);
}
