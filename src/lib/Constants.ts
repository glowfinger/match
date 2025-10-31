export const Colours = {
	NAVY: '#111C4E',
	GOLD: '#fcb437',
	PINK: '#f0c8d9',
	WHITE: '#ffffff',
	BLACK: '#0a0a0a',
};

export const UploadImageTypes = {
	MAIN: 'main',
};

export type MediaImageType = {
	type: string;
	label: string;
};

export const MediaImageTypes: MediaImageType[] = [
	{
		type: 'MATCH',
		label: 'Match',
	},
	{
		type: 'CANCELLED',
		label: 'Cancelled',
	},
	{
		type: 'RESCHEDULED',
		label: 'Rescheduled',
	},
	{
		type: 'RESULT',
		label: 'Result',
	},
	{
		type: 'TEAM',
		label: 'Team',
	},
	{
		type: 'LINEUP',
		label: 'Lineup',
	},
	{
		type: 'LINEUP_LIST',
		label: 'Lineup List',
	},
	{
		type: 'highlight',
		label: 'Highlight',
	},
];

export type Sponsor = {
	name: string;
	logo: string;
	handle: string;
	sections: string[];
	level: string;
};

export const SPONSORS: Sponsor[] = [
	{
		name: 'Furniture Village',
		logo: 'https://glowfinger.blob.core.windows.net/smg/sponsors/furniture-village.png',
		handle: '@furniturevillage',
		sections: ['1XV', '2XV'],
		level: '1',
	},
	{
		name: 'Formation Lighting',
		logo: 'https://glowfinger.blob.core.windows.net/smg/sponsors/formation-lighting.png',
		handle: ' @formation_lighting',
		sections: ['1XV', '2XV'],
		level: '2',
	},
];

export const SOCIAL_TAGS = ['#UTC'];
