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
	import Sonner from '$lib/components/ui/sonner/sonner.svelte';
	import { toast } from 'svelte-sonner';

	let matches: Match[] = $state([]);
	let emptyMatches: Match[] = $state([]);

	onMount(async () => {
		matches = await getMatches();
		emptyMatches = matches.filter(isNewMatch);
	});

	function isNewMatch(match: Match) {
		return Object.keys(match).length === 3;
	}

	async function handleClearEmptyMatches() {
		matches.filter(isNewMatch).forEach(async (match) => {
			await deleteMatch(match.id);
		});

		toast.success('Empty matches removed');
		matches = await getMatches();
		emptyMatches = matches.filter(isNewMatch);
	}

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Admin', href: '/admin' },
	];
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Admin</HeadingLg>

<HeadingMd>Matches</HeadingMd>
<p>This will remove matches that have no information set</p>
<Button variant="destructive" onclick={handleClearEmptyMatches}
	>Delete empty matches ({emptyMatches.length})</Button
>
<a href="/players" class="variant-filled-primary btn">View players</a>
<a href="/clubs" class="variant-filled-primary btn">View Clubs</a>
