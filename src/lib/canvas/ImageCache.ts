import { addImageFile, getImageFile } from '$lib/database/services/ImageFileDbService';

export async function getImageBitmap(url: string): Promise<ImageBitmap> {
	const [, imageFile] = await getImageFile(url);

	if (imageFile) {
		return await createImageBitmap(imageFile.blob);
	}

	// todo how do I handle errors here?
	const response = await fetch(url).then((response) => response.blob());

	await addImageFile({ url, blob: response });

	return await createImageBitmap(response);
}

