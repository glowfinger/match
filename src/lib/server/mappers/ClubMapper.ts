type Club = {
	key: string;
	name: string;
	badge: string;
};

const STORAGE_PATH_CLUBS = 'https://glowfinger.blob.core.windows.net/smg/other-badges/';

export async function clubMapper(row: string[]): Promise<Club[]> {
	return row
		.map((club) => {
			const [key, name, badge] = club;

			return {
				key,
				name,
				badge,
			};
		})
		.map((club) => {
			return {
				...club,
				badge: `${STORAGE_PATH_CLUBS}${club.badge}`,
			};
		});
}
