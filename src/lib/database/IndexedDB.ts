import type { Event, EventImage } from '$lib/types/Event';
import Dexie, { type EntityTable } from 'dexie';

export interface Match {
	id: number;
	createdAt: string;
	updatedAt: string;
	userAgent: string;
	team?: MatchTeam;
	opponent?: MatchOpponent;
	schedule?: MatchSchedule;
	detail?: MatchDetail;
	kit?: MatchKit;
	result?: MatchResult;
	points?: MatchPoints[];
}

export interface MatchPoints {
	playerKey: string | null;
	for: 'player' | 'unknown' | 'team';
	minute: string | null;
	tries: number;
	conversions: number;
	penalties: number;
	dropGoals: number;
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

export interface MatchResult {
	homeScore: number;
	awayScore: number;
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
	kit: string;
}

export interface MatchKit {
	type: string;
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
	type: string;
	role: string;
}

export interface MatchTag {
	id: number;
	matchId: number;
	playerKey: string;
	type: string;
}

export interface MatchImage {
	id: number;
	matchId: number;
	type: string;
	page: number;
	base64: string;
	createdAt: string;
}

export interface Club {
	key: string;
	name: string;
	badge: string;
	image?: string;
}

export interface Font {
	id: number;
	type: string;
	blob: ArrayBuffer;
}

export interface Player {
	key: string;
	bio: PlayerBio;
	positions: PlayerPosition;

	images: PlayerImage[];
	tags: PlayerTag;
	social: { instagram: string };
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
	thumbnail: string;
	headshot: string;
	large: string;
}

export interface PlayerTag {
	homegrown: boolean;
}
export interface Selection {
	id: number;
	matchId: number;
	playerKey: string;
	available: string;
}

export interface BackgroundImage {
	id: number;
	type: string;
	page: number;
	blob: Blob;
}

export interface ImageFile {
	url: string;
	blob: Blob;
}

export interface ImageUpload {
	id: number;
	matchId: number;
	mediaType: string;
	uploadType: string;
	createdAt: string;
	blob: Blob;
	meta: {
		filename: string;
		filesize: number;
		mimetype: string;
	};
	settings: {
		x: number;
		y: number;
		zoom: number;
	};
}

const db = new Dexie('MatchDatabase') as Dexie & {
	matches: EntityTable<Match, 'id'>;
	players: EntityTable<Player, 'key'>;
	selections: EntityTable<Selection, 'id'>;
	matchPositions: EntityTable<MatchPosition, 'id'>;
	matchRoles: EntityTable<MatchRole, 'id'>;
	matchTags: EntityTable<MatchTag, 'id'>;
	clubs: EntityTable<Club, 'key'>;
	fonts: EntityTable<Font, 'id'>;
	matchImages: EntityTable<MatchImage, 'id'>;
	backgroundsImages: EntityTable<BackgroundImage, 'id'>;
	events: EntityTable<Event, 'uuid'>;
	eventsImages: EntityTable<EventImage, 'id'>;
	imageFiles: EntityTable<ImageFile, 'url'>;
	imageUploads: EntityTable<ImageUpload, 'id'>;
};

db.version(3.4).stores({
	matches: '++id',
	players: 'key',
	selections: '++id, [matchId+playerKey], [matchId+available]',
	matchPositions:
		'++id, [matchId+playerKey+position+type], [matchId+position+type], [matchId+playerKey+type]',
	matchRoles:
		'++id,[matchId+type], [matchId+playerKey+role],  [matchId+role+type], [playerKey+matchId+role+type]',
	matchTags: '++id, [matchId+playerKey+type], [matchId+type]',
	matchImages: '++id, [matchId], [matchId+type+page],[matchId+type]',
	clubs: 'key',
	fonts: '++id',
	events: 'uuid, [createdAt], [template]',
	eventsImages: '++id, [eventUuid+type]',
	imageFiles: 'url',
	imageUploads: '++id, [matchId+mediaType+uploadType]',
});

export { db };
