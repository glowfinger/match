<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import CardButton from '$lib/components/CardButton.svelte';
	import CardList from '$lib/components/CardList.svelte';
	import PlayerCard from '$lib/components/PlayerCard.svelte';
	import { isMainPosition, isOtherPosition, SHIRT_NUMBERS } from '$lib/counts/PlayerCounts';
	import { getMatch } from '$lib/database/MatchService';
	import { getPlayers } from '$lib/database/PlayerDBService';
	import {
		deleteMatchPlayer,
		deleteMatchPositions,
		getMatchPositions,
		setPosition,
	} from '$lib/database/MatchPositionDBService';
	import { getSelections, setSelection } from '$lib/database/SelectionDBService';
	import { isAvailable } from '$lib/filters/SelectionFilter';
	import type { Match, MatchPosition, Player, Selection } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { toast } from 'svelte-sonner';

	const matchId = Number.parseInt($page.params.id);
	const position = $page.params.position;

	let match: Match | undefined = $state();
	let players: Player[] = $state([]);
	let selections: Selection[] = $state([]);
	let mains: Player[] = $state([]);
	let secondary: Player[] = $state([]);
	let not: Player[] = $state([]);
	let matchPositions: MatchPosition[] = $state([]);

	onMount(async () => {
		const allPlayer = await getPlayers();

		match = await getMatch(Number.parseInt($page.params.id));

		selections = (await getSelections(matchId)).filter(isAvailable);
		players = allPlayer.filter((player) =>
			selections.some((selection) => selection.playerKey === player.key),
		);

		const key = SHIRT_NUMBERS.get(position) as string;
		mains = players.filter((player) => isMainPosition(player, key));
		secondary = players.filter((player) => isOtherPosition(player, key));
		not = players.filter((player) => !isMainPosition(player, key) && !isOtherPosition(player, key));

		matchPositions = await getMatchPositions(matchId);
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: 'Manage lineup', href: `/match/${matchId}/lineup` },
		{ name: 'Position', href: `/match/${matchId}/lineup/position` },
	];

	const key = SHIRT_NUMBERS.get(position);

	async function handleStart(playerKey: string) {
		if (hasStart(playerKey)) {
			await deleteMatchPositions(matchId, position, 'start');
			matchPositions = await getMatchPositions(matchId);
		} else {
			await deleteMatchPositions(matchId, position, 'start');
			await deleteMatchPlayer(matchId, playerKey, 'start');
			await setPosition(playerKey, matchId, position, 'start');
			matchPositions = await getMatchPositions(matchId);
		}

		toast.success('Selected');
		goto(`/match/${matchId}/lineup`);
	}

	async function handleReplacement(playerKey: string) {
		hasReplacement(playerKey)
			? await deleteMatchPositions(matchId, position, 'replacement')
			: await setPosition(playerKey, matchId, position, 'replacement');
		matchPositions = await getMatchPositions(matchId);
	}

	function alreadyStarting(playerKey: string): boolean {
		return matchPositions.some(
			(matchPosition) =>
				matchPosition.matchId === matchId &&
				matchPosition.playerKey === playerKey &&
				matchPosition.type === 'start',
		);
	}

	function hasStart(playerKey: string): boolean {
		return matchPositions.some(
			(matchPosition) =>
				matchPosition.matchId === matchId &&
				matchPosition.playerKey === playerKey &&
				matchPosition.position === position &&
				matchPosition.type === 'start',
		);
	}

	function hasReplacement(playerKey: string): boolean {
		return matchPositions.some(
			(matchPosition) =>
				matchPosition.matchId === matchId &&
				matchPosition.playerKey === playerKey &&
				matchPosition.position === position &&
				matchPosition.type === 'replacement',
		);
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>{key}</HeadingLg>

{#if !match}
	<p>Match not found</p>
{:else}
	<HeadingMd>Main</HeadingMd>
	<CardList>
		{#each mains as player}
			<PlayerCard {player} isSelected={alreadyStarting(player.key)}>
				<CardButton onClick={() => handleStart(player.key)} active={hasStart(player.key)}
					>Start</CardButton
				>
			</PlayerCard>
		{/each}
	</CardList>

	<HeadingMd>Secondary</HeadingMd>
	<CardList>
		{#each secondary as player}
			<PlayerCard {player} isSelected={alreadyStarting(player.key)}>
				<CardButton onClick={() => handleStart(player.key)} active={hasStart(player.key)}
					>Start</CardButton
				>
			</PlayerCard>
		{/each}
	</CardList>
	<HeadingMd>Unfavoured</HeadingMd>
	<CardList>
		{#each not as player}
			<PlayerCard {player} isSelected={alreadyStarting(player.key)}>
				<CardButton onClick={() => handleStart(player.key)} active={hasStart(player.key)}
					>Start</CardButton
				>
			</PlayerCard>
		{/each}
	</CardList>
{/if}
