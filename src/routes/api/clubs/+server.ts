import { getClubs } from '$lib/server/services/DataService.js';
import { json } from '@sveltejs/kit';

export async function GET() {
	return json(await getClubs());
}
