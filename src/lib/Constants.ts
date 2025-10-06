export const Colours = {
	NAVY: '#111C4E',
	GOLD: '#fcb437',
	PINK: '#f0c8d9',
	WHITE: '#ffffff',
	BLACK: '#0a0a0a',
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
	// {
	// 	type: 'CANCELLED',
	// 	label: 'Cancelled',
	// },
	// {
	// 	type: 'RESCHEDULED',
	// 	label: 'Rescheduled',
	// },
	{
		type: 'RESULT',
		label: 'Result',
	},
	// {
	// 	type: 'TEAM',
	// 	label: 'Team',
	// },
	{
		type: 'LINEUP',
		label: 'Lineup',
	},
	// {
	// 	type: 'highlight',
	// 	label: 'Highlight',
	// },
];

export const SPONSORS = [
	{
		name: 'Furniture Village',
		logo: 'https://glowfinger.blob.core.windows.net/chipstead/sponsors/furniture-village.png',
		handle: '@furniturevillage',
		sections: ['SENIOR'],
	},
	{
		name: 'Murphy Digital',
		logo: 'https://glowfinger.blob.core.windows.net/chipstead/sponsors/murphy-digital.png',
		handle: '@murphy_digital',
		sections: ['SENIOR'],
	},
	{
		name: 'Sandy Trees',
		logo: 'https://glowfinger.blob.core.windows.net/chipstead/sponsors/sandy-trees.png',
		handle: ' @sandy_trees',
		sections: ['SENIOR'],
	},
	{
		name: 'Aspire Commerncial',
		logo: 'https://glowfinger.blob.core.windows.net/chipstead/sponsors/aspire-commercial.png',
		handle: '',
		sections: ['SENIOR'],
	},
];
