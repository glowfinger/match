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

export interface MatchCompetition {
	type: string;
	round: number;
	stage: string;
	other: string;
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
	venue: string;
	address: string;
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

export interface Club {
	key: string;
	name: string;
	badge: string;
	image?: string;
}

// export type Team = {
// 	name: string;
// 	badge: string;
// 	country?: string;
// 	socials?: {
// 		facebook?: string;
// 		twitter?: string;
// 		instagram?: string;
// 		linkedin?: string;
// 		youtube?: string;
// 	};
// 	website?: string;
// 	address?: string;
// };

const db = new Dexie('MatchDatabase') as Dexie & {
	matches: EntityTable<Match, 'id'>;
	players: EntityTable<Player, 'key'>;
	selections: EntityTable<Selection, 'id'>;
	matchPositions: EntityTable<MatchPosition, 'id'>;
	clubs: EntityTable<Club, 'key'>;
};

db.version(1).stores({
	matches: '++id',
	players: 'key',
	selections: '++id, [matchId+playerKey]',
	matchPositions:
		'++id, [matchId+playerKey+position+type], [matchId+position+type], [matchId+playerKey+type]',
	clubs: 'key',
});

export { db };
