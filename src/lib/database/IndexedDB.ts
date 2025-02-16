import Dexie, { type EntityTable } from 'dexie';

export interface Match {
	id: number;
	createdAt: string;
	userAgent: string;
	team?: MatchTeam;
	opponent?: MatchOpponent;
	schedule?: MatchSchedule;
	detail?: MatchDetail;
}

export interface MatchTeam {
	key: string;
	club: string;
	squad: string;
	badge: string;
}

export interface MatchOpponent {
	key: string;
	squad: string;
	club: string;
	badge: string;
}

export interface MatchSchedule {
	matchOn: string;
	meetAt: string;
	kickOffAt: string;
}

export interface MatchDetail {
	address: string;
	venue: string;
	type: string;
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

export interface MatchRole {
	id: number;
	matchId: number;
	playerKey: string;
	role: string;
}

export interface MatchTag {
	id: number;
	matchId: number;
	playerKey: string;
	type: string;
}

export interface Club {
	key: string;
	name: string;
	badge: string;
	image?: string;
}

const db = new Dexie('MatchDatabase') as Dexie & {
	matches: EntityTable<Match, 'id'>;
	players: EntityTable<Player, 'key'>;
	selections: EntityTable<Selection, 'id'>;
	matchPositions: EntityTable<MatchPosition, 'id'>;
	matchRoles: EntityTable<MatchRole, 'id'>;
	matchTags: EntityTable<MatchTag, 'id'>;
	clubs: EntityTable<Club, 'key'>;
};

db.version(1).stores({
	matches: '++id',
	players: 'key',
	selections: '++id, [matchId+playerKey]',
	matchPositions:
		'++id, [matchId+playerKey+position+type], [matchId+position+type], [matchId+playerKey+type]',
	matchRoles: '++id, [matchId+playerKey+role],  [matchId+role]',
	matchTags: '++id, [matchId+playerKey+type], [matchId+type]',
	clubs: 'key',
});

export { db };
