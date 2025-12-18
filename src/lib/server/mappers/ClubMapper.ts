type Club = {
	key: string;
	name: string;
	badge: string;
};

const STORAGE_PATH_CLUBS = 'https://glowfinger.blob.core.windows.net/smg/other-badges/';

export async function clubMapper(row: string[]): Promise<Club[]> {
	return row
		.map((club) => {
			const [key, name, badge, , , , instagram, website, code] = club;

			return {
				key,
				name,
				badge,
				code: code ?? '',
				socials: {
					instagram: instagram ?? '',
					website: website ?? '',
				},
			};
		})
		.map((club) => {
			return {
				...club,
				badge: `${STORAGE_PATH_CLUBS}${club.badge}`,
			};
		});
}
