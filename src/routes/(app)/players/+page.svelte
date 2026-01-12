<script lang="ts">
	import { onMount } from 'svelte';
	import type { Player } from '$lib/database/IndexedDB';
	import { getPlayers } from '$lib/database/PlayerDBService';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PlayerCard from '$lib/components/cards/player/PlayerCard.svelte';
	import filterPlayers from '$lib/filters/PlayerFilter';
	import TextInput from '$lib/components/forms/TextInput.svelte';

	let players: Player[] = $state([]);
	let filteredPlayers: Player[] = $state([]);
	let search = $state('');

	$effect(() => {
		filteredPlayers = filterPlayers(players, search);
	});

	onMount(async () => {
		players = await getPlayers();
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Players', href: '/players' },
	];
</script>

<Breadcrumb {breadcrumbs} />
<TextInput id="search" title="Search" placeholder="Search for a player" bind:value={search} />

<div class="grid grid-cols-1 gap-2">
	{#each filteredPlayers as player}
		<PlayerCard {player} />
	{/each}
</div>
