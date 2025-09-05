import { db, type Font } from './IndexedDB';

const FONTS_TO_ADD = [
	{ type: 'thin', url: '/fonts/poppins/Poppins-Thin.ttf' },
	{ type: 'regular', url: '/fonts/poppins/Poppins-Regular.ttf' },
	{ type: 'black', url: '/fonts/poppins/Poppins-Black.ttf' },
	{ type: 'semiBold', url: '/fonts/poppins/Poppins-SemiBold.ttf' },
	{ type: 'headline-flames', url: '/fonts/BebasNeue-Regular.ttf' },
	{ type: 'cta-flames', url: '/fonts/roboto/Roboto-Medium.ttf' },
];

export async function getFonts(): Promise<Font[]> {
	return await db.fonts.toArray();
}

export async function addFonts(): Promise<Font[]> {
	return Promise.all(
		FONTS_TO_ADD.map((font) => {
			return fetch(font.url)
				.then((response) => response.arrayBuffer())
				.then((blob) => db.fonts.add({ type: font.type, blob }));
		}),
	).then(() => {
		return getFonts();
	});
}

export async function clearFonts() {
	return await db.fonts.clear();
}

export async function hasFonts(): Promise<boolean> {
	const fonts = await getFonts();
	const hadFontsInDb = fonts.length !== 0;
	const allFontsLoaded = fonts.length === FONTS_TO_ADD.length;
	return hadFontsInDb && allFontsLoaded;
}
