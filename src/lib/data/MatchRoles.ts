const AwardRoles = [
	{ label: 'Forwards MOTM', value: 'forwards-motm', type: 'awards' },
	{ label: 'Backs MOTM', value: 'backs-motm', type: 'awards' },
	{ label: 'MOTM', value: 'motm', type: 'awards' },
	{ label: 'Dick of the day', value: 'dick-of-the-day', type: 'awards' },
];

const LeadershipRoles = [
	{ label: 'Captain', value: 'captain', type: 'leadership' },
	{ label: 'Vice Captain', value: 'vice-captain', type: 'leadership' },
	{ label: 'Pack leader', value: 'pack-leader', type: 'leadership' },
];

export const AllRoles = [...AwardRoles, ...LeadershipRoles];
