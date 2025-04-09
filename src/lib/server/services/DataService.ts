import { PRIVATE_GOOGLE_API_SHEET_ID } from '$env/static/private';
import credentials from '$lib/server/Credentials';
import { google } from 'googleapis';
import { clubMapper } from '../mappers/ClubMapper';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const SPREADSHEET_ID = PRIVATE_GOOGLE_API_SHEET_ID;

export async function getClubs() {
	const SHEET_NAME = 'clubs';
	const sheets = await loadSheet();

	return await sheets.spreadsheets.values
		.get({
			spreadsheetId: SPREADSHEET_ID,
			range: SHEET_NAME,
		})
		.then(handleResponse)
		.then(clubMapper);
}

async function loadSheet() {
	const auth = new google.auth.GoogleAuth({
		credentials: credentials,
		scopes: SCOPES,
	});

	const client = await auth.getClient();

	return google.sheets({ version: 'v4', auth: client as any });
}

function handleResponse(response: any) {
	if (!response.data.values) {
		return [];
	}
	response.data.values.shift();
	return response.data.values;
}
