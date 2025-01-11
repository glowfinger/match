<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import MatchCard from '$lib/components/cards/MatchCard.svelte';
	import { addMatch, deleteMatch, getMatches } from '$lib/database/MatchService';
	import type { Match } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { goto } from '$app/navigation';

	let matches: Match[] = $state([]);

	onMount(async () => {
		matches = await getMatches();
	});

	function isNewMatch(match: Match) {
		return Object.keys(match).length === 3;
	}

	async function handleClearEmptyMatches() {
		matches.filter(isNewMatch).forEach(async (match) => {
			await deleteMatch(match.id);
		});

		matches = await getMatches();
	}

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Admin', href: '/admin' },
	];
</script>

<div class="mt-4 grid grid-cols-1 gap-2">
	<Breadcrumb {breadcrumbs} />
	<HeadingLg>Admin</HeadingLg>

	<HeadingMd>Matches</HeadingMd>
	<p>This will remove matches that have no information set</p>
	<Button variant="destructive" on:click={handleClearEmptyMatches}>Delete empty matches</Button>
	<a href="/players" class="variant-filled-primary btn">View players</a>
	<a href="/clubs" class="variant-filled-primary btn">View Clubs</a>
</div>
