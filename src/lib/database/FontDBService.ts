import { db, type Font } from './IndexedDB';

export async function getFonts(): Promise<Font[]> {
	return await db.fonts.toArray();
}

export async function addFonts(): Promise<Font[]> {
	return Promise.all([
		fetch('/fonts/poppins/Poppins-Thin.ttf')
			.then((response) => response.arrayBuffer())
			.then((blob) => db.fonts.add({ type: 'thin', blob })),
		fetch('/fonts/poppins/Poppins-Regular.ttf')
			.then((response) => response.arrayBuffer())
			.then((blob) => db.fonts.add({ type: 'regular', blob })),
		fetch('/fonts/poppins/Poppins-Black.ttf')
			.then((response) => response.arrayBuffer())
			.then((blob) => db.fonts.add({ type: 'black', blob })),
		fetch('/fonts/poppins/Poppins-SemiBold.ttf')
			.then((response) => response.arrayBuffer())
			.then((blob) => db.fonts.add({ type: 'semiBold', blob })),
	]).then(() => {
		return getFonts();
	});
}

export async function clearFonts() {
	return await db.fonts.clear();
}

export async function hasFonts(): Promise<boolean> {
	return (await db.fonts.count()) !== 0;
}
