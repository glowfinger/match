import { json } from '@sveltejs/kit';
import { getClubs } from '$lib/server/services/DataService.js';

export async function GET() {
	return json(await getClubs());
}
