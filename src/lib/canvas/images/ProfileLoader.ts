import type { Player } from '$lib/database/IndexedDB';
import { getImageBitmap } from '../ImageCache';

const IMAGE_KIT_SECONDARY = 'SECONDARY';

const base_url = 'https://glowfinger.blob.core.windows.net/smg/background-removed/';

export default async function profileLoader(kit: string, player: Player, type: string) {
	const DEFAULT_IMAGE_NAME = getDefaultImageName(kit);
	const headshot = findHeadshot(kit, player);
	const URI = headshot ? `${base_url}${headshot.url}.png` : `${base_url}${DEFAULT_IMAGE_NAME}`;

	return await getImageBitmap(URI);
}

function getDefaultImageName(kit: string) {
	return kit === IMAGE_KIT_SECONDARY ? 'default-away.png' : 'default-home.png';
}

function findHeadshot(kit: string, player: Player) {
	const kitType = kit === IMAGE_KIT_SECONDARY ? 'away' : 'home';

	return player.images.find((img) => img.type === 'profile-front' && img.kit === kitType);
}

export function findFinisherImage(player: Player, kit: string, type: string) {
	const kitType = kit === IMAGE_KIT_SECONDARY ? 'away' : 'home';

	let image = player.images.find((img) => img.type === type && img.kit === kitType);

	if (!image) {
		image = player.images.find((img) => img.type === type && img.kit === 'default');
	}

	return image;
}
