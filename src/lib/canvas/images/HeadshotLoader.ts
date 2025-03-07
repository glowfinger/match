import type { Player } from '$lib/database/IndexedDB';

const IMAGE_KIT_HOME = 'home';
const IMAGE_KIT_AWAY = 'away';

// TODO bring this from config
const base_url = 'https://glowfinger.blob.core.windows.net/smg/thumbnails-260x260/';
export default async function headshotLoader(kit: string, player: Player) {
	const DEFAULT_IMAGE_NAME = kit === IMAGE_KIT_AWAY ? 'default-away.png' : 'default-home.png';

	const headshot = player.images.find((img) => img.type === 'profile-front' && img.kit === kit);
	const URI = headshot ? `${base_url}${headshot.url}.png` : `${base_url}${DEFAULT_IMAGE_NAME}`;

	const img = await fetch(URI)
		.then((response) => response.blob())
		.then(async (blob) => await createImageBitmap(blob));

	return img;
}
