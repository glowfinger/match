import { db, type Club } from '$lib/database/IndexedDB';

export async function getClub(key: string): Promise<Club> {
	const club = await db.clubs.get(key);
	if (club) {
		return club;
	}
	throw new Error('Club not found');
}

export async function getClubs(): Promise<Club[]> {
	return await db.clubs.toArray();
}

export async function updateClub(club: Club): Promise<Club> {
	await db.clubs.update(club.key, club);
	return await getClub(club.key);
}

export async function addClubs(data: Club[]): Promise<Club[]> {
	await db.clubs.bulkAdd(data);
	return await getClubs();
}
export async function clearClubs() {
	return await db.clubs.clear();
}
