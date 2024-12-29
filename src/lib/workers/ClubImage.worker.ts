import { updateClub } from '$lib/database/ClubDbService';
import type { Club } from '$lib/database/IndexedDB';

onmessage = async (e: MessageEvent) => {
	const clubs: Club[] = e.data;

	clubs.forEach(async (club) => {
		club.image = await toDataURL(club.badge);

		await updateClub(club);
		postMessage({ task: 'LOADED_CLUB_IMAGE', data: club });
	});
};

async function toDataURL(url: string): Promise<string> {
	try {
		const response = await fetch(url);
		const blob = await response.blob();
		const reader = new FileReader();
		return new Promise((resolve, reject) => {
			reader.onloadend = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});
	} catch (error) {
		console.error(error);
		return '';
	}
}
