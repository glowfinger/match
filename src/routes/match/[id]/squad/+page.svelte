<script lang="ts">
	import { page } from '$app/state';
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
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';

	const matchId = Number.parseInt(page.params.id);

	let match: Match | undefined = $state();
	let players: Player[] = $state([]);
	let selections: Selection[] = $state([]);

	let search = new SvelteURLSearchParams(page.url.searchParams);

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

	let listing = $derived(filterPlayers(search, players, selections));

	function filterPlayers(
		search: SvelteURLSearchParams,
		players: Player[],
		selections: Selection[],
	) {
		const AVAILABLE = 'available';
		const filters = search.getAll(AVAILABLE);

		if (filters.length === 0) {
			return players;
		}

		let keys: string[] = [];

		if (filters.includes('UNANSWERED') && filters.length === 1) {
			return players.filter((player) => {
				return !selections.some((selection) => selection.playerKey === player.key);
			});
		}

		if (filters.includes('YES')) {
			selections.forEach((selection) => {
				if (selection.available === 'yes') {
					keys.push(selection.playerKey);
				}
			});
		}

		if (filters.includes('NO')) {
			selections.forEach((selection) => {
				if (selection.available === 'no') {
					keys.push(selection.playerKey);
				}
			});
		}

		if (filters.includes('MAYBE')) {
			selections.forEach((selection) => {
				if (selection.available === 'maybe') {
					keys.push(selection.playerKey);
				}
			});
		}

		if (filters.includes('UNANSWERED')) {
			players.forEach((player) => {
				if (!selections.some((selection) => selection.playerKey === player.key)) {
					keys.push(player.key);
				}
			});
		}

		return players.filter((player) => keys.includes(player.key));
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Manage squad</HeadingLg>

{#if !match}
	<p>Match not found</p>
{:else}
	<HeadingMd>Filters</HeadingMd>
	<SelectionStats {players} {selections} {search} />
	<Separator />
	<HeadingMd>Players</HeadingMd>
	<CardList>
		{#each listing as player}
			<PlayerCard {player}>
				<CardButton onClick={() => handleYes(player.key)} active={isYes(player.key)}>Yes</CardButton
				>
				<CardButton onClick={() => handleNo(player.key)} active={isNo(player.key)}>No</CardButton>
				<CardButton onClick={() => handleMaybe(player.key)} active={isMaybe(player.key)}
					>Maybe</CardButton
				>
			</PlayerCard>
		{/each}
	</CardList>
{/if}
