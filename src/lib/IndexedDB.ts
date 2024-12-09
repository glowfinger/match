import Dexie, { type EntityTable } from 'dexie';

export interface Match {
	id: number;
	type: string;
	matchOn: string;
	squad: string;
	team: string;
}

export interface Player {
	key: string;
	bio: PlayerBio;
	positions: PlayerPosition;
	images: PlayerImage[];
}

export interface PlayerBio {
	first: string;
	last: string;
	screen: string;
	age: number | null;
}

export interface PlayerPosition {
	main: string;
	other: [string];
}

export interface PlayerImage {
	type: string;
	kit: string;
	url: string;
}

export interface Selection {
	id: number;
	matchId: number;
	playerKey: string;
	available: string;
}

export interface Position {
	id: number;
	matchId: number;
	playerKey: string;
	position: string;
}

const db = new Dexie('MatchDatabase') as Dexie & {
	matches: EntityTable<Match, 'id'>;
	players: EntityTable<Player, 'key'>;
	selections: EntityTable<Selection, 'id'>;
	positions: EntityTable<Position, 'id'>;
};

db.version(1).stores({
	matches: '++id, [matchOn+team+squad+type]',
	players: 'key',
	selections: '++id, [matchId+playerKey]',
	positions: '++id, [matchId+playerKey+position]',
});

// if (navigator.storage && navigator.storage.estimate) {
// 	const estimation = await navigator.storage.estimate();
// 	console.log(`Quota: ${estimation.quota}`);
// 	console.log(`Usage: ${estimation.usage}`);
// } else {
// 	console.error('StorageManager not found');
// }

export { db };
