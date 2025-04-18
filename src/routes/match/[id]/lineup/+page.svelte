<script lang="ts">
	import { page } from '$app/state';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import LineupSelector from '$lib/components/LineupSelector.svelte';
	import { getMatch } from '$lib/database/MatchService';
	import { getPlayers } from '$lib/database/PlayerDBService';
	import { getMatchPositions, getPositions } from '$lib/database/MatchPositionDBService';
	import { getSelections } from '$lib/database/SelectionDBService';
	import { isAvailable } from '$lib/filters/SelectionFilter';
	import type { Match, MatchPosition, Player, Selection } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';
	import PlayerCard from '$lib/components/PlayerCard.svelte';
	import PlayerAvatar from '$lib/components/avatars/PlayerAvatar.svelte';
	import FinisherCard from '$lib/components/cards/FinisherCard.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';

	const matchId = Number.parseInt(page.params.id);

	let match: Match | undefined = $state();
	let players: Player[] = $state([]);
	let replacements: Player[] = $state([]);
	let selections: Selection[] = $state([]);
	let matchPositions: MatchPosition[] = $state([]);

	onMount(async () => {
		const allPlayer = await getPlayers();

		match = await getMatch(matchId);

		selections = (await getSelections(matchId)).filter(isAvailable);
		players = allPlayer.filter((player) =>
			selections.some((selection) => selection.playerKey === player.key),
		);

		matchPositions = await getMatchPositions(matchId);

		replacements = allPlayer
			.filter((player) => selections.some((selection) => selection.playerKey === player.key))
			.filter(
				(player) =>
					matchPositions.filter(
						(position) => position.playerKey === player.key && position.type === 'start',
					).length === 0,
			);

		const info = matchPositions.map((position) => {
			const player = players.find((player) => player.key === position.playerKey);
			return { key: player?.key, position: position.position };
		});
		console.log(
			JSON.stringify(
				info
					.map((player) => {
						return { key: player.key, position: parseInt(player.position) };
					})
					.toSorted((a, b) => a.position - b.position),
			),
		);

		console.log(
			JSON.stringify(replacements.map((player) => ({ key: player.key, position: null }))),
		);
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: 'Manage lineup', href: `/match/${matchId}/lineup` },
	];
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Manage Lineup</HeadingLg>

{#if !match}
	<p>Match not found</p>
{:else if players.length === 0}
	<p>No players selected</p>
{:else}
	<HeadingMd>Starters</HeadingMd>
	<LineupSelector {matchId} {players} {matchPositions} />

	<HeadingMd>Finishers</HeadingMd>
	{#each replacements as player}
		<FinisherCard {player} />
	{:else}
		<p>No bench</p>
	{/each}
{/if}
