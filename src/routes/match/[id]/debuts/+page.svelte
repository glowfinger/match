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
		{ name: 'Manage lineup', href: `/match/${matchId}/lineup` },
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
		return position?.position ?? 'F';
	}

	function getPostionName(player: Player) {
		const position = matchPositions.find((position) => position.playerKey === player.key);
		return SHIRT_NUMBERS_LINEUP.get(position?.position ?? 'Finisher') ?? 'Finisher';
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Manage Lineup</HeadingLg>

{#each [...players, ...replacements] as player}
	<div class="col-span-1 divide-y divide-gray-200 bg-white shadow-sm">
		<div class="flex w-full items-center justify-between space-x-2 p-2">
			<div class="shrink-0">
				<span
					class="inline-flex size-10 items-center justify-center rounded-full border border-slate-900 bg-gray-100"
				>
					<span class="font-bold text-slate-900">{getPostion(player)}</span>
				</span>
			</div>
			{#if player && player.images?.length > 0}
				<div class="shrink-0">
					<img
						class="size-10 rounded-full"
						src={`https://glowfinger.blob.core.windows.net/smg/thumbnails-260x260/${player.images[0].url}.png`}
						alt=""
					/>
				</div>
			{:else if player}
				<PlayerAvatar {player} />
			{:else}
				<div class="shrink-0">
					<span
						class="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100"
					>
						<span class="font-bold text-white"></span>
					</span>
				</div>
			{/if}
			<div class="flex-1 truncate">
				<div class="flex items-center space-x-3">
					<h3 class="truncate text-sm font-medium text-gray-900">{player.bio.screen}</h3>

					{#if isDebut(player)}
						<span
							class="inline-flex shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset"
							>Debut</span
						>
					{/if}
				</div>
				<p class="mt-1 truncate text-sm text-gray-500">{getPostionName(player)}</p>
			</div>
		</div>
		<div>
			{#if !isDebut(player)}
				<div class="-mt-px flex divide-x divide-gray-200">
					<div class="flex w-0 flex-1">
						<button
							onclick={() => handleOnClick(player)}
							class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
						>
							Set Debut
						</button>
					</div>
				</div>
			{:else}
				<div class="-mt-px flex divide-x divide-gray-200">
					<div class="flex w-0 flex-1">
						<button
							onclick={() => handleOnClick(player)}
							class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
						>
							Remove Debut
						</button>
					</div>
				</div>{/if}
		</div>
	</div>

	<!-- <button onclick={() => handleOnClick(player)}
		>{player.bio.screen}
		{#if debuts.find((debut) => debut.playerKey === player.key)}
			--------{/if}
	</button> -->
{/each}

{#if !match}
	<p>Match not found</p>
{:else if players.length === 0}
	<p>No players selected</p>
{:else}{/if}
