<script lang="ts">
	import { onMount } from 'svelte';
	import type { Player } from '$lib/database/IndexedDB';
	import { getPlayers } from '$lib/database/PlayerDBService';
	import PlayerCard from '$lib/components/PlayerCard.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import CardList from '$lib/components/CardList.svelte';
	import TeamStats from '$lib/components/stats/TeamStats.svelte';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';

	let players: Player[] = $state([]);

	let filtersOpen = $state(false);

	onMount(async () => {
		players = await getPlayers();
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Players', href: '/players' },
	];
</script>

<!-- <Sheet.Root open={filtersOpen} onOpenChange={() => (filtersOpen = !filtersOpen)}>
	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>Filters</Sheet.Title>
		</Sheet.Header>
		<TeamStats {players} />
		<Sheet.Footer>
			<Sheet.Close>Save changes</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root> -->
<Breadcrumb {breadcrumbs} />
<HeadingLg>Match Schedule</HeadingLg>

<div class="grid grid-cols-1 gap-2">
	<!-- <button class="variant-filled-primary btn" onclick={() => (filtersOpen = true)}
		>Open filters {filtersOpen}</button
	> -->

	<a href="/players/load" class="variant-filled-primary btn">Load players</a>

	<CardList>
		{#each players as player}
			<PlayerCard {player} />
		{/each}
	</CardList>
</div>
