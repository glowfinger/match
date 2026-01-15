<script lang="ts">
	import { onMount } from 'svelte';
	import type { Match } from '$lib/database/IndexedDB';
	import { getMatches } from '$lib/database/MatchService';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import MatchCard from '$lib/components/cards/MatchCard.svelte';
	import { sortByDate } from '$lib/utils/sorts/ClubSort';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';

	let matches: Match[] = [];

	onMount(async () => {
		matches = await getMatches();
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Matches', href: '/matches' },
	];
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Matches</HeadingLg>

<HeadingMd>Info</HeadingMd>
<div class="grid grid-cols-1 gap-2">
	{#each matches.toSorted(sortByDate) as match}
		<a href={`/match/${match.id}`} class="focus:outline-hidden">
			<MatchCard {match} />
		</a>
	{/each}
</div>
