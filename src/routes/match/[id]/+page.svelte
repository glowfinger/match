<script lang="ts">
	import { page } from '$app/stores';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getMatch } from '$lib/database/MatchService';
	import type { Match } from '$lib/IndexedDB';
	import { onMount } from 'svelte';

	const matchId = Number.parseInt($page.params.id);

	let match: Match | undefined = $state();

	onMount(async () => {
		match = await getMatch(matchId);
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
	];
</script>

<div class="grid grid-cols-1 gap-4">
	<h1 class="h1">Match Day</h1>
	<Breadcrumb {breadcrumbs} />
	{#if !match}
		<p>Match not found</p>
	{:else}
		<a href={`/match/${match.id}/squad`} class="variant-filled-primary btn">Manage squad</a>
		<a href={`/match/${match.id}/lineup`} class="variant-filled-primary btn">Manage lineup</a>
	{/if}
</div>
