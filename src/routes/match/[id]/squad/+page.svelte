<script lang="ts">
	import { page } from '$app/stores';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import CardButton from '$lib/components/CardButton.svelte';
	import CardList from '$lib/components/CardList.svelte';
	import PlayerCard from '$lib/components/PlayerCard.svelte';
	import SelectionStats from '$lib/components/stats/SelectionStats.svelte';
	import { getMatch } from '$lib/database/MatchService';
	import { getPlayers } from '$lib/database/PlayerDBService';
	import { getSelections, setSelection } from '$lib/database/SelectionDBService';
	import type { Match, Player, Selection } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';

	const matchId = Number.parseInt($page.params.id);
	let query = $page.url.searchParams;
	let match: Match | undefined = $state();
	let players: Player[] = $state([]);
	let selections: Selection[] = $state([]);

	onMount(async () => {
		match = await getMatch(matchId);
		players = await getPlayers();
		selections = await getSelections(matchId);
	});

	async function handleYes(key: string) {
		await setSelection(key, matchId, 'yes');
		selections = await getSelections(matchId);
	}

	async function handleNo(key: string) {
		await setSelection(key, matchId, 'no');
		selections = await getSelections(matchId);
	}

	async function handleMaybe(key: string) {
		await setSelection(key, matchId, 'maybe');
		selections = await getSelections(matchId);
	}

	function hasSelection(key: string, status: string) {
		return selections.find((s) => s.playerKey === key && s.available === status) !== undefined;
	}

	function isYes(key: string) {
		return hasSelection(key, 'yes');
	}

	function isNo(key: string) {
		return hasSelection(key, 'no');
	}

	function isMaybe(key: string) {
		return hasSelection(key, 'maybe');
	}

	function getSelection(key: string) {
		const selection = selections.find((s) => s.playerKey === key);
		return selection ? selection.available : '';
	}

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: 'Manage squad', href: `/match/${matchId}/squad` },
	];

	let declined = $derived(players.filter((player) => isNo(player.key)));

	let possible = $derived(players.filter((player) => !isNo(player.key)));
</script>

<div class="grid grid-cols-1 gap-4">
	<h1 class="h1">Manage squad</h1>
	<Breadcrumb {breadcrumbs} />

	{#if !match}
		<p>Match not found</p>
	{:else}
		<SelectionStats {players} {selections} />
		<CardList>
			{#each possible as player}
				<PlayerCard {player}>
					<CardButton onClick={() => handleYes(player.key)} active={isYes(player.key)}
						>Yes</CardButton
					>
					<CardButton onClick={() => handleNo(player.key)} active={isNo(player.key)}>No</CardButton>
					<CardButton onClick={() => handleMaybe(player.key)} active={isMaybe(player.key)}
						>Maybe</CardButton
					>
				</PlayerCard>
			{/each}
		</CardList>

		<h3 class="h3">Declined {declined.length}</h3>
		<CardList>
			{#each declined as player}
				<PlayerCard {player}>
					<CardButton onClick={() => handleYes(player.key)} active={isYes(player.key)}
						>Yes</CardButton
					>
					<CardButton onClick={() => handleNo(player.key)} active={isNo(player.key)}>No</CardButton>
					<CardButton onClick={() => handleMaybe(player.key)} active={isMaybe(player.key)}
						>Maybe</CardButton
					>
				</PlayerCard>
			{/each}
		</CardList>
	{/if}
</div>
