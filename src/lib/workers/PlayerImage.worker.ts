import { addPlayers, clearPlayers, getPlayers } from '$lib/database/PlayerDBService';
import type { Player } from '$lib/database/IndexedDB';
import { getApiPlayers } from '$lib/services/api/PlayerApiService';

onmessage = async (e: MessageEvent) => {
	let cleared: Player[] = [];
	let added: Player[] = [];
	let names: string[] = [];

	cleared = await getPlayers();
	await clearPlayers();

	postMessage({ task: 'CLEARED_PLAYERS', data: cleared });

	const data = await getApiPlayers();
	console.log(data);
	await addPlayers(data);
	added = await getPlayers();

	names = added
		.filter((elem) => !cleared.find(({ key }) => elem.key === key))
		.map(({ bio }) => bio.screen);

	console.log('PlayerImageLoader: Message received from main script');
	postMessage({ task: 'ADDED_PLAYERS', names });
};
