import Dexie, { type EntityTable } from 'dexie';

interface Match {
	id: number;
	type: string;
	matchOn: string;
	squad: string;
	team: string;
}

interface Player {
	key: string;
	bio: PlayerBio;
}

interface PlayerBio {
	first: string;
	last: string;
	screen: string;
	age: number | null;
}

interface Selection {
	id: number;
	matchId: number;
	playerKey: string;
	available: string;
}

const db = new Dexie('MatchDatabase') as Dexie & {
	matches: EntityTable<Match, 'id'>;
	players: EntityTable<Player, 'key'>;
	selections: EntityTable<Selection, 'id'>;
};

db.version(1).stores({
	matches: '++id, [matchOn+team+squad+type]',
	players: 'key',
	selections: '++id, [matchId+playerKey]',
});

export type { Match, Player, Selection };

export { db };
