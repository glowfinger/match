import type { Player } from '$lib/IndexedDB';
import exp from 'constants';

const LOOSE_HEAD = '1: Loose-head prop';
const HOOKER = '2: Hooker';
const TIGHT_HEAD = '3: Tight-head prop';
const SECOND_ROW = '4/5: Second row';
const BLIND_SIDE = '6: Blind-side flanker';
const OPEN_SIDE = '7: Open-side flanker';
const NUMBER_EIGHT = '8: Number 8';
const SCRUM_HALF = '9: Scrum-half';
const FLY_HALF = '10: Fly-half';
const WING = '11/14: Wing';
const INSIDE_CENTRE = '12: Inside centre';
const OUTSIDE_CENTRE = '13: Outside centre';
const FULL_BACK = '15: Full-back';

export const SHIRT_NUMBERS = new Map([
	['1', LOOSE_HEAD],
	['2', HOOKER],
	['3', TIGHT_HEAD],
	['4', SECOND_ROW],
	['5', SECOND_ROW],
	['6', BLIND_SIDE],
	['7', OPEN_SIDE],
	['8', NUMBER_EIGHT],
	['9', SCRUM_HALF],
	['10', FLY_HALF],
	['11', WING],
	['12', INSIDE_CENTRE],
	['13', OUTSIDE_CENTRE],
	['14', WING],
	['15', FULL_BACK],
]);

export const POSITION_NAMES = new Map([
	[LOOSE_HEAD, 'Loose-head prop'],
	[HOOKER, 'Hooker'],
	[TIGHT_HEAD, 'Tight-head prop'],
	[SECOND_ROW, 'Second row'],
	[BLIND_SIDE, 'Blind-side flanker'],
	[OPEN_SIDE, 'Open-side flanker'],
	[NUMBER_EIGHT, 'Number 8'],
	[SCRUM_HALF, 'Scrum-half'],
	[FLY_HALF, 'Fly-half'],
	[WING, 'Wing'],
	[INSIDE_CENTRE, 'Inside centre'],
	[OUTSIDE_CENTRE, 'Outside centre'],
	[FULL_BACK, 'Full-back'],
]);

const FRONT_ROW = [LOOSE_HEAD, HOOKER, TIGHT_HEAD] as const;
const BACK_ROW = [BLIND_SIDE, OPEN_SIDE, NUMBER_EIGHT] as const;

export function countBackRow(players: Player[]): number {
	return players.filter((player) => canPlay(player, BACK_ROW)).length;
}

export function countFrontRow(players: Player[]): number {
	return players.filter((player) => canPlay(player, FRONT_ROW)).length;
}

export function countProps(players: Player[]): number {
	return players.filter((player) => canPlay(player, [LOOSE_HEAD, TIGHT_HEAD])).length;
}

export function countHookers(players: Player[]): number {
	return players.filter((player) => canPlay(player, [HOOKER])).length;
}

export function canPlay(player: Player, positions: readonly string[]): boolean {
	return positions.some(
		(position) => isMainPosition(player, position) || isOtherPosition(player, position),
	);
}

export function isMainPosition(player: Player, position: string): boolean {
	return player.positions.main === position;
}

export function isOtherPosition(player: Player, position: string): boolean {
	const positions = player.positions.other.filter((pos) => pos !== player.positions.main);
	console.log(player.positions.other, positions, position);

	return positions.includes(position);
}
