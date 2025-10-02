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
	import { page } from '$app/state';
	import MatchCard from '$lib/components/cards/MatchCard.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import LinkCard from '$lib/components/cards/LinkCard.svelte';
	import StadiumIcon from '$lib/components/icons/StadiumIcon.svelte';
	import CalendarIcon from '$lib/components/icons/CalendarIcon.svelte';
	import FortIcon from '$lib/components/icons/FortIcon.svelte';
	import SwordIcon from '$lib/components/icons/SwordIcon.svelte';

	if (!page.params.id) {
		throw new Error('Match ID is required');
	}

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

	const MANAGE_LINKS = [
		{ label: 'Team', href: `/match/${matchId}/team`, icon: FortIcon },
		{ label: 'Opposition', href: `/match/${matchId}/opposition`, icon: SwordIcon },
		{ label: 'Details', href: `/match/${matchId}/details`, icon: StadiumIcon },
		{ label: 'Schedule', href: `/match/${matchId}/schedule`, icon: CalendarIcon },
	];
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Match</HeadingLg>
{#if !match}
	<p>Match not found</p>
{:else}
	<MatchCard {match} />
	<Separator />
	<HeadingMd>Info</HeadingMd>

	<a href={`/match/${match.id}/team`} class="variant-filled-primary btn">Team</a>
	<a href={`/match/${match.id}/opposition`} class="variant-filled-primary btn">Opposition</a>
	<a href={`/match/${match.id}/details`} class="variant-filled-primary btn">Details</a>
	<a href={`/match/${match.id}/schedule`} class="variant-filled-primary btn">Schedule</a>

	<Separator />

	<HeadingMd>Manage</HeadingMd>

	<ul role="list" class="grid grid-cols-4 gap-2">
		{#each MANAGE_LINKS as link}
			<LinkCard {link} />
		{/each}
	</ul>

	<Separator />

	<HeadingMd>Media</HeadingMd>
	<a href={`/match/${match.id}/media`} class="variant-filled-primary btn">Media (WIP)</a>
	<Separator />
	<HeadingMd>Analysis</HeadingMd>
	<a href={`/match/${match.id}/analysis`} class="variant-filled-primary btn">Analysis dashboad</a>
	<HeadingMd>Admin</HeadingMd>
	<a href={`/match/${match.id}/remove`} class="variant-filled-primary btn">Remove match</a>
{/if}
