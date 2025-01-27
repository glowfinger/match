<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getMatch } from '$lib/database/MatchService';
	import { getPlayers } from '$lib/database/PlayerDBService';
	import { getSelections } from '$lib/database/SelectionDBService';
	import { isAvailable } from '$lib/filters/SelectionFilter';
	import type { Match, Player, Selection } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { page } from '$app/state';

	const matchId = Number.parseInt(page.params.id);

	let match: Match | undefined = $state();
	let players: Player[] = $state([]);
	let selections: Selection[] = $state([]);

	onMount(async () => {
		match = await getMatch(matchId);

		selections = (await getSelections(matchId)).filter(isAvailable);
		players = (await getPlayers()).filter((player) =>
			selections.some((selection) => selection.playerKey === player.key),
		);
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
	];
</script>

<div class="mt-4 grid grid-cols-1 gap-2">
	<Breadcrumb {breadcrumbs} />
	<HeadingLg>Match</HeadingLg>
	{#if !match}
		<p>Match not found</p>
	{:else}
		<pre>{JSON.stringify(match, null, 2)}</pre>
		<Separator />
		<HeadingMd>Info</HeadingMd>
		<a href={`/match/${match.id}/team`} class="variant-filled-primary btn">Team</a>
		<a href={`/match/${match.id}/opposition`} class="variant-filled-primary btn">Opposition</a>
		<a href={`/match/${match.id}/details`} class="variant-filled-primary btn">Details</a>
		<a href={`/match/${match.id}/schedule`} class="variant-filled-primary btn">Schedule</a>
		<Separator />
		<HeadingMd>Roster</HeadingMd>
		<a href={`/match/${match.id}/squad`} class="variant-filled-primary btn">Manage squad</a>
		<a href={`/match/${match.id}/lineup`} class="variant-filled-primary btn">Manage lineup</a>
		<Separator />
		<HeadingMd>Other</HeadingMd>
		<a href={`/match/${match.id}/media`} class="variant-filled-primary btn">Media</a>
	{/if}
</div>
