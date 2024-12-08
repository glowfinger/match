<script lang="ts">
	import { page } from '$app/stores';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getMatch } from '$lib/database/MatchService';
	import { getPlayers } from '$lib/database/PlayerDBService';
	import { setSelection } from '$lib/database/SelectionDBService';
	import type { Match, Player } from '$lib/IndexedDB';
	import { onMount } from 'svelte';

	const matchId = Number.parseInt($page.params.id);
	let query = $page.url.searchParams;
	let match: Match | undefined = $state();
	let players: Player[] = $state([]);

	let yesses: string[] = [];
	let nos: string[] = [];
	let maybes: string[] = [];

	onMount(async () => {
		match = await getMatch(matchId);
		players = await getPlayers();
	});

	function handleYes(key: string) {
		console.log('Yes');

		setSelection(key, matchId, 'yes');
	}

	function handleNo(key: string) {
		console.log('No');
		setSelection(key, matchId, 'no');
	}

	function handleMaybe(key: string) {
		console.log('Maybe');
		setSelection(key, matchId, 'maybe');
	}

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: 'Manage squad', href: `/match/${matchId}/squad` },
	];
</script>

<div class="grid grid-cols-1 gap-4">
	<h1 class="h1">Manage squad</h1>
	<Breadcrumb {breadcrumbs} />

	{#if !match}
		<p>Match not found</p>
	{:else}
		<ul class="list">
			{#each players as player}
				<li>
					<div class="variant-filled btn-group">
						<button onclick={() => handleYes(player.key)}>Y</button>
						<button onclick={() => handleNo(player.key)}>N</button>
						<button onclick={() => handleMaybe(player.key)}>?</button>
					</div>

					<span class="flex-auto">{player.bio.first} {player.bio.last}</span>
				</li>
			{/each}
		</ul>
	{/if}
</div>
