import { PRIVATE_GOOGLE_API_SHEET_ID } from '$env/static/private';
import { google } from 'googleapis';
import type { LayoutServerLoad } from '../../$types';
import credentials from '$lib/server/Credentials';
import { error } from '@sveltejs/kit';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const SPREADSHEET_ID = PRIVATE_GOOGLE_API_SHEET_ID;

import { json } from '@sveltejs/kit';

export async function GET(match) {
	return json(await load());
}

async function load() {
	const auth = new google.auth.GoogleAuth({
		credentials: credentials,
		scopes: SCOPES,
	});

	const client = await auth.getClient();

	const sheets = google.sheets({ version: 'v4', auth: client as any });

	const [playerResponse, images, tagResponse] = await Promise.all([
		// const [playerResponse] = await Promise.all([
		sheets.spreadsheets.values
			.get({
				spreadsheetId: SPREADSHEET_ID,
				range: 'Form responses 1',
			})
			.then(handleResponse),
		sheets.spreadsheets.values
			.get({
				spreadsheetId: SPREADSHEET_ID,
				range: 'images',
			})
			.then(handleResponse)
			.then((values) => {
				return values.map(imageMapper);
			}),
		sheets.spreadsheets.values
			.get({
				spreadsheetId: SPREADSHEET_ID,
				range: 'tags',
			})
			.then(handleResponse)
			.then((values) => {
				return values.map(tagMapper);
			}),
	]);

	// const images = getImages(imageResponse);
	// const tags = getTags(tagResponse);

	const players: any[] = playerResponse
		.map(rowToPlayer)
		.sort((a, b) => {
			const result = a.bio.first.localeCompare(b.bio.first);
			return result !== 0 ? result : a.bio.last.localeCompare(b.bio.last);
		})
		.map((player) => {
			player.images = images
				.filter((image) => image.playerKey === player.key)
				.map((image) => {
					return {
						type: image.imageType,
						kit: image.kitType,
						url: image.image,
					};
				});
			return player;
		});

	// 	return player;
	// });
	// .map((player) => {
	// 	const playerTags = tags.find((tag) => {
	// 		return tag.playerKey === player.key;
	// 	});

	// 	if (playerTags) {
	// 		player.tags = {
	// 			homegrown: playerTags.homegraph,
	// 		};
	// 	} else {
	// 		player.tags = {
	// 			homegrown: false,
	// 		};
	// 	}
	// 	return player;
	// });
	return players;
}

const CREATED_AT_COLUMN = 0;
const FIRSTNAME_COLUMN = 1;
const LASTNAME_COLUMN = 2;
const DOB_COLUMN = 4;
const OTHER_POSITION_COLUMN = 5;
const MAIN_POSITION_COLUMN = 6;

function rowToPlayer(data: string[]) {
	const row = data.map((d) => d.trim());
	return {
		key: getPlayerKey(row),
		bio: getPlayerBio(row),
		social: {
			instagram: row[3],
		},
		positions: getPlayerPosition(row),
	};
}

function getPlayerBio(row: string[]) {
	return {
		first: row[FIRSTNAME_COLUMN],
		last: row[LASTNAME_COLUMN],
		screen: `${row[FIRSTNAME_COLUMN].substring(0, 1)}. ${row[LASTNAME_COLUMN]}`,
		age: getPlayerAge(row),
	};
}

function getPlayerPosition(row: string[]) {
	return {
		main: row[MAIN_POSITION_COLUMN],
		other: row[OTHER_POSITION_COLUMN].split(',').map((p) => p.trim()),
	};
}

function getPlayerKey(row: string[]) {
	const regex = /[^a-zA-Z0-9]/g;

	const values = [row[FIRSTNAME_COLUMN], row[LASTNAME_COLUMN], row[CREATED_AT_COLUMN]].map((s) =>
		s.replace(regex, ''),
	);
	return values.join('-').normalize().toLowerCase();
}

function getPlayerAge(row: string[]) {
	var parts = row[DOB_COLUMN].split('/');

	const dob = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
	const diff = Date.now() - dob.getTime();
	const age = new Date(diff);
	return Math.abs(age.getUTCFullYear() - 1970);
}

function imageMapper(row: string[]) {
	return {
		playerKey: row[0].trim(),
		imageType: row[1].trim(),
		kitType: row[2] ? row[2].trim() : '',
		image: row[3] ? row[3].trim() : '',
	};
}

function tagMapper(row: string[]) {
	return {
		playerKey: row[0].trim(),
		homegrown: row[1] ? row[1].trim().toUpperCase() === 'Y' : false,
	};
}

function handleResponse(response: any) {
	if (!response.data.values) {
		return [];
	}
	response.data.values.shift();
	return response.data.values;
}
