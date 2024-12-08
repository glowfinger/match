<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { addPlayers, clearPlayers, getPlayers } from '$lib/database/PlayerDBService';
	import { type Player } from '$lib/IndexedDB';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getApiPlayers } from '$lib/services/api/PlayerApiService';

	let status = $state('STARTING');
	let cleared: Player[] = $state([]);
	let added: Player[] = $state([]);

	let names: string[] = $state([]);

	onMount(async () => {
		cleared = await getPlayers();
		await clearPlayers();

		const data = await getApiPlayers();
		await addPlayers(data);
		added = await getPlayers();

		names = added
			.filter((elem) => !cleared.find(({ key }) => elem.key === key))
			.map(({ bio }) => bio.screen);
		status = 'LOADED';
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Players', href: '/players' },
		{ name: 'Load', href: '/players/load' },
	];
</script>

<Breadcrumb {breadcrumbs} />

{#if status === 'STARTING'}
	<h1 class="h1">Loading players</h1>
{:else}
	<h1 class="h1">Players loaded</h1>
	<p>Cleared: {cleared.length}</p>
	<p>Added: {added.length}</p>
	<p>New Players</p>
	<ul>
		{#each names as name}
			<li>{name}</li>
		{/each}
	</ul>
{/if}
