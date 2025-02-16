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
	<a href={`/match/${match.id}/squad`} class="variant-filled-primary btn">Squad</a>
	<a href={`/match/${match.id}/lineup`} class="variant-filled-primary btn">Lineup</a>
	<a href={`/match/${match.id}/roles`} class="variant-filled-primary btn">Roles</a>
	<a href={`/match/${match.id}/debuts`} class="variant-filled-primary btn">Debuts</a>
	<Separator />

	<div class="overflow-hidden border border-slate-900">
		<div class="flex items-center gap-x-4 border-b border-gray-900/5 bg-slate-700 px-2 py-4">
			<h2 class="text-2xl font-bold leading-none tracking-tight text-white">Media</h2>
		</div>
		<dl class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm/6">
			<div class="flex justify-between gap-x-4 py-3">
				<dt class="text-gray-500">Last invoice</dt>
				<dd class="text-gray-700"><time datetime="2023-01-23">January 23, 2023</time></dd>
			</div>
			<div class="flex justify-between gap-x-4 py-3">
				<dt class="text-gray-500">Amount</dt>
				<dd class="flex items-start gap-x-2">
					<div class="font-medium text-gray-900">$7,600.00</div>
					<div
						class="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
					>
						Paid
					</div>
				</dd>
			</div>
		</dl>
	</div>

	<!-- <HeadingMd>Media</HeadingMd>
	<a href={`/match/${match.id}/media`} class="variant-filled-primary btn">Media (WIP)</a> -->
	<HeadingMd>Admin</HeadingMd>
	<a href={`/match/${match.id}/remove`} class="variant-filled-primary btn">Remove match</a>
{/if}
