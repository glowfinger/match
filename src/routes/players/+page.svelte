<script lang="ts">
	import { onMount } from 'svelte';
	import type { Player } from '$lib/database/IndexedDB';
	import { getPlayers } from '$lib/database/PlayerDBService';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import CardList from '$lib/components/CardList.svelte';
	import TeamStats from '$lib/components/stats/TeamStats.svelte';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import PlayerCard from '$lib/components/cards/player/PlayerCard.svelte';

	let players: Player[] = $state([]);

	let filtersOpen = $state(false);

	onMount(async () => {
		players = await getPlayers();
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Players', href: '/players' },
	];
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Players</HeadingLg>

<a href="/players/load" class="variant-filled-primary btn">Load players</a>

<div class="grid grid-cols-1 gap-2">
	{#each players as player}
		<PlayerCard {player} />
	{/each}
</div>
