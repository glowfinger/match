<script lang="ts">
	import { page } from '$app/stores';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import CardButton from '$lib/components/CardButton.svelte';
	import CardList from '$lib/components/CardList.svelte';
	import PlayerCard from '$lib/components/PlayerCard.svelte';
	import { isMainPosition, isOtherPosition, SHIRT_NUMBERS } from '$lib/counts/PlayerCounts';
	import { getMatch } from '$lib/database/MatchService';
	import { getPlayers } from '$lib/database/PlayerDBService';
	import { setPosition } from '$lib/database/PositionDBService';
	import { getSelections, setSelection } from '$lib/database/SelectionDBService';
	import { isAvailable } from '$lib/filters/SelectionFilter';
	import type { Match, Player, Selection } from '$lib/IndexedDB';
	import { onMount } from 'svelte';

	const matchId = Number.parseInt($page.params.id);
	const position = $page.params.position;

	let match: Match | undefined = $state();
	let players: Player[] = $state([]);
	let selections: Selection[] = $state([]);
	let mains: Player[] = $state([]);
	let secondary: Player[] = $state([]);
	let not: Player[] = $state([]);

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
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: 'Manage lineup', href: `/match/${matchId}/lineup` },
		{ name: 'Position', href: `/match/${matchId}/lineup/position` },
	];

	const key = SHIRT_NUMBERS.get(position);

	async function handleSelect(playerKey: string) {
		await setPosition(playerKey, matchId, position);
	}
</script>

<Breadcrumb {breadcrumbs} />

{#if !match}
	<p>Match not found</p>
{:else}
	<h1 class="h1">{position}</h1>
	<h2 class="h2">{key}</h2>

	<h2 class="h2">Main</h2>
	<CardList>
		{#each mains as player}
			<PlayerCard {player}>
				<CardButton onClick={() => handleSelect(player.key)} />
				<CardButton onClick={() => handleSelect(player.key)} />
				<CardButton onClick={() => handleSelect(player.key)} />
				<CardButton onClick={() => handleSelect(player.key)} />
			</PlayerCard>
		{/each}
	</CardList>

	<h2 class="h2">Secondary</h2>
	<CardList>
		{#each secondary as player}
			<PlayerCard {player}>
				<div class="variant-filled-primary btn-group">
					<button onclick={() => handleSelect(player.key)}>Y</button>
				</div>
			</PlayerCard>
		{/each}
	</CardList>
	<h2 class="h2">Not</h2>
	<CardList>
		{#each not as player}
			<PlayerCard {player}>
				<div class="variant-filled-primary btn-group">
					<button onclick={() => handleSelect(player.key)}>Y</button>
				</div>
			</PlayerCard>
		{/each}
	</CardList>
{/if}
