<script lang="ts">
	import { onMount } from 'svelte';
	import type { Match } from '$lib/database/IndexedDB';
	import { getMatches } from '$lib/database/MatchService';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import MatchCard from '$lib/components/cards/MatchCard.svelte';
	import { sortByDate } from '$lib/utils/sorts/ClubSort';

	let matches: Match[] = [];

	onMount(async () => {
		matches = await getMatches();
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Matches', href: '/matches' },
	];
</script>

<HeadingLg>Matches</HeadingLg>
<Breadcrumb {breadcrumbs} />

{#each matches.toSorted(sortByDate) as match}
	<a href={`/match/${match.id}`} class="focus:outline-none">
		<MatchCard {match} />
	</a>
{/each}
