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

export interface MatchPosition {
	id: number;
	matchId: number;
	playerKey: string;
	position: string;
	type: 'start' | 'replacement' | 'possible';
}

const db = new Dexie('MatchDatabase') as Dexie & {
	matches: EntityTable<Match, 'id'>;
	players: EntityTable<Player, 'key'>;
	selections: EntityTable<Selection, 'id'>;
	matchPositions: EntityTable<MatchPosition, 'id'>;
};

db.version(1).stores({
	matches: '++id, [matchOn+team+squad+type]',
	players: 'key',
	selections: '++id, [matchId+playerKey]',
	matchPositions:
		'++id, [matchId+playerKey+position+type], [matchId+position+type], [matchId+playerKey+type]',
});

export { db };
