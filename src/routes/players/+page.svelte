<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	import type { Player } from '$lib/IndexedDB';
	import { getPlayers } from '$lib/database/PlayerDBService';
	import PlayerCard from '$lib/components/PlayerCard.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import CardList from '$lib/components/CardList.svelte';
	import TeamStats from '$lib/components/stats/TeamStats.svelte';

	let players: Player[] = $state([]);

	onMount(async () => {
		players = await getPlayers();
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Players', href: '/players' },
	];
</script>

<div class="grid grid-cols-1 gap-2">
	<h1 class="h1">Players</h1>

	<Breadcrumb {breadcrumbs} />

	<a href="/players/load" class="variant-filled-primary btn">Load players</a>

	<TeamStats {players} />
	<CardList>
		{#each players as player}
			<PlayerCard {player} />
		{/each}
	</CardList>
</div>
