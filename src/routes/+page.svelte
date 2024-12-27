<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import MatchCard from '$lib/components/cards/MatchCard.svelte';
	import { getMatch, getMatches } from '$lib/database/MatchService';
	import type { Match } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';

	let matches: Match[] = $state([]);

	onMount(async () => {
		matches = await getMatches();
	});

	const breadcrumbs = [{ name: 'Home', href: '/' }];
</script>

<div class="grid grid-cols-1 gap-2">
	<h1 class="h1">Matches</h1>
	<Breadcrumb {breadcrumbs} />
</div>
<div class="grid grid-cols-1 gap-2">
	<a href="/match/new" class="variant-filled-primary btn">Add New match</a>

	<a href="/players" class="variant-filled-primary btn">View players</a>
	<a href="/clubs" class="variant-filled-primary btn">View Clubs</a>
</div>
<div class="grid grid-cols-1 gap-2">
	<h2 class="h2">Matches</h2>
	{#each matches as match}
		<MatchCard {match} />
	{/each}
</div>
