<script lang="ts">
	import { page } from '$app/stores';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import TeamStats from '$lib/components/stats/TeamStats.svelte';
	import { getMatch } from '$lib/database/MatchService';
	import { getPlayers } from '$lib/database/PlayerDBService';
	import { getSelections } from '$lib/database/SelectionDBService';
	import { isAvailable } from '$lib/filters/SelectionFilter';
	import type { Match, Player, Selection } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';

	const matchId = Number.parseInt($page.params.id);

	let match: Match | undefined = $state();
	let players: Player[] = $state([]);
	let selections: Selection[] = $state([]);

	onMount(async () => {
		match = await getMatch(matchId);

		selections = (await getSelections(matchId)).filter(isAvailable);
		players = (await getPlayers()).filter((player) =>
			selections.some((selection) => selection.playerKey === player.key),
		);
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
	];
</script>

<div class="grid grid-cols-1 gap-4">
	<h1 class="h1">Match Day</h1>
	<Breadcrumb {breadcrumbs} />
	{#if !match}
		<p>Match not found</p>
	{:else}
		<a href={`/match/${match.id}/squad`} class="variant-filled-primary btn">Manage squad</a>
		<a href={`/match/${match.id}/lineup`} class="variant-filled-primary btn">Manage lineup</a>
		<a href={`/match/${match.id}/details`} class="variant-filled-primary btn">Match details</a>
		<a href={`/match/${match.id}/teams`} class="variant-filled-primary btn">Teams</a>
		<a href={`/match/${match.id}/images`} class="variant-filled-primary btn">Images</a>
	{/if}

	<TeamStats {players} />
</div>
