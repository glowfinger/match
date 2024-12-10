<script lang="ts">
	import { page } from '$app/stores';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import LineupSelector from '$lib/components/LineupSelector.svelte';
	import { getMatch } from '$lib/database/MatchService';
	import { getPlayers } from '$lib/database/PlayerDBService';
	import { getPositions } from '$lib/database/PositionDBService';
	import { getSelections } from '$lib/database/SelectionDBService';
	import { isAvailable } from '$lib/filters/SelectionFilter';
	import type { Match, Player, Position, Selection } from '$lib/IndexedDB';
	import { onMount } from 'svelte';

	const matchId = Number.parseInt($page.params.id);

	let match: Match | undefined = $state();
	let players: Player[] = $state([]);
	let selections: Selection[] = $state([]);
	let positions: Position[] = $state([]);

	onMount(async () => {
		const allPlayer = await getPlayers();

		match = await getMatch(Number.parseInt($page.params.id));

		selections = (await getSelections(matchId)).filter(isAvailable);
		players = allPlayer.filter((player) =>
			selections.some((selection) => selection.playerKey === player.key),
		);

		positions = await getPositions(matchId);
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: 'Manage lineup', href: `/match/${matchId}/lineup` },
	];
</script>

{#if !match}
	<p>Match not found</p>
{:else}
	<div class="grid grid-cols-1 gap-4">
		<h1 class="h1">Manage Lineup</h1>
		<Breadcrumb {breadcrumbs} />

		<LineupSelector {positions} />

		{#if players.length === 0}
			<p>No players selected</p>
		{/if}

		<ul class="list">
			{#each players as player}
				<li>
					<span>(icon)</span>
					<span class="flex-auto">{player.bio.first} {player.bio.last}</span>
				</li>
			{/each}
		</ul>
	</div>
{/if}

<pre class="text-xs">{JSON.stringify({ selections, players }, null, 2)}</pre>
