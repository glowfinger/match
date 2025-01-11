<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getMatch } from '$lib/database/MatchService';

	import type { Match } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import { page } from '$app/state';

	const matchId = Number.parseInt(page.params.id);

	let match: Match | undefined = $state();

	onMount(async () => {
		match = await getMatch(matchId);
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: 'Opposition', href: `/match/${matchId}/opposition` },
	];
</script>

<div class="mt-4 grid grid-cols-1 gap-2">
	<Breadcrumb {breadcrumbs} />
	<HeadingLg>Opposition</HeadingLg>
	{#if !match}
		<p>Match not found</p>
	{:else}{/if}
</div>
