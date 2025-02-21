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
];
