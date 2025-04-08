export interface Note {
	id: number;
	source: string;
	startAt: number;
	endAt: number;
	message: string;
	highlight: boolean;
	ruck?: NoteRuck;
	lineout?: NoteLineout;
	rating?: NoteRating;
	zone?: NoteZone;
}

export interface NoteRuck {
	type: string;
	team: string;
	outcome: string;
}

export interface NoteLineout {
	type: string;
	team: string;
	outcome: string;
}

export interface NoteRating {
	rating: string;
}

export interface NoteZone {
	zone: string;
	channel: string;
}
