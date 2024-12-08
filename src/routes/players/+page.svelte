<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	import type { Player } from '$lib/IndexedDB';
	import { getPlayers } from '$lib/database/PlayerDBService';
	import PlayerCard from '$lib/components/PlayerCard.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let players = writable<Player[]>([]);

	onMount(async () => {
		players.set(await getPlayers());
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

	<div class="grid grid-cols-1 gap-2">
		{#each $players as player}
			<PlayerCard {player} />
		{/each}
	</div>
</div>
