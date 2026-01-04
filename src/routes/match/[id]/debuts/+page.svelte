<script lang="ts">
	import { page } from '$app/state';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import LineupSelector from '$lib/components/LineupSelector.svelte';
	import { getMatch } from '$lib/database/MatchService';
	import { getPlayers } from '$lib/database/PlayerDBService';
	import { getMatchPositions, getPositions } from '$lib/database/MatchPositionDBService';
	import { getSelections } from '$lib/database/SelectionDBService';
	import { isAvailable } from '$lib/filters/SelectionFilter';
	import type { Match, MatchPosition, MatchTag, Player, Selection } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';

	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { getMatchTags, setMatchTag } from '$lib/database/MatchTagDBService';
	import { sortByMatchPostion } from '$lib/utils/sorts/MatchPositionSort';
	import { SHIRT_NUMBERS, SHIRT_NUMBERS_LINEUP } from '$lib/counts/PlayerCounts';
	import PlayerAvatar from '$lib/components/avatars/PlayerAvatar.svelte';
	import type { LayoutProps } from '../$types';
	import PlayerCard from '$lib/components/cards/player/PlayerCard.svelte';
	import CardButton from '$lib/components/CardButton.svelte';

	let { data }: LayoutProps = $props();
	const { matchId, match, matchTile } = data;

	let players: Player[] = $state([]);
	let replacements: Player[] = $state([]);
	let selections: Selection[] = $state([]);
	let matchPositions: MatchPosition[] = $state([]);

	let debuts: MatchTag[] = $state([]);

	onMount(async () => {
		const allPlayer = await getPlayers();

		selections = (await getSelections(matchId)).filter(isAvailable);

		matchPositions = await getMatchPositions(matchId);

		players = matchPositions.toSorted(sortByMatchPostion).map((selection) => {
			return allPlayer.find((player) => player.key === selection.playerKey) as Player;
		});

		replacements = allPlayer
			.filter((player) => selections.some((selection) => selection.playerKey === player.key))
			.filter(
				(player) =>
					matchPositions.filter(
						(position) => position.playerKey === player.key && position.type === 'start',
					).length === 0,
			);

		debuts = await getMatchTags(matchId, 'debut');
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: matchTile, href: `/match/${matchId}` },

		{ name: 'Debuts', href: `/match/${matchId}/debuts` },
	];

	async function handleOnClick(player: Player) {
		await setMatchTag(matchId, player.key, 'debut');
		debuts = await getMatchTags(matchId, 'debut');
	}

	function isDebut(player: Player) {
		return debuts.find((debut) => debut.playerKey === player.key);
	}

	function getPostion(player: Player) {
		const position = matchPositions.find((position) => position.playerKey === player.key);
		return position?.position ?? '';
	}

	function getPostionName(player: Player) {
		const position = matchPositions.find((position) => position.playerKey === player.key);
		return SHIRT_NUMBERS_LINEUP.get(position?.position ?? 'Finisher') ?? 'Finisher';
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Manage Lineup</HeadingLg>

{#each [...players, ...replacements] as player}
	<PlayerCard {player} position={getPostion(player)}>
		{#if !isDebut(player)}
			<div class="-mt-px flex divide-x divide-gray-200">
				<div class="flex w-0 flex-1">
					<CardButton onClick={() => handleOnClick(player)}>Set Debut</CardButton>
				</div>
			</div>
		{:else}
			<div class="-mt-px flex divide-x divide-gray-200">
				<div class="flex w-0 flex-1">
					<CardButton onClick={() => handleOnClick(player)}>Remove Debut</CardButton>
				</div>
			</div>{/if}
	</PlayerCard>
{/each}

{#if !match}
	<p>Match not found</p>
{:else if players.length === 0}
	<p>No players selected</p>
{:else}{/if}
