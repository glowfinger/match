<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import MatchCard from '$lib/components/cards/MatchCard.svelte';
	import { addMatch, getMatches } from '$lib/database/MatchService';
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

	async function handleNewMatch() {
		const data = {
			createdAt: new Date().toISOString(),
			userAgent: navigator.userAgent,
		};

		const { id } = await addMatch(data.createdAt, data.userAgent);
		goto(`/match/${id}`);
	}

	const breadcrumbs = [{ name: 'Home', href: '/' }];
</script>

<div class="mt-2 grid grid-cols-1 gap-4">
	<Breadcrumb {breadcrumbs} />
	<HeadingLg>Match manager</HeadingLg>

	<Button onclick={handleNewMatch}>Add New match</Button>

	<HeadingMd>Matches</HeadingMd>
	{#each matches as match}
		<MatchCard {match} />
	{/each}
</div>
