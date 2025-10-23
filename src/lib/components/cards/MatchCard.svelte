<script lang="ts">
	import type { Match, MatchOpponent, MatchTeam } from '$lib/database/IndexedDB';
	import { matchDate, socialDate } from '$lib/helpers/dateTime/ConvertTime';
	import CalendarIcon from '../icons/CalendarIcon.svelte';
	import FortIcon from '../icons/FortIcon.svelte';
	import StadiumIcon from '../icons/StadiumIcon.svelte';
	import SwordIcon from '../icons/SwordIcon.svelte';

	type Props = {
		match: Match;
	};

	let { match }: Props = $props();

	let venue = $derived(match.detail?.venue ?? 'HOME');
	let venueLetter = $derived(match.detail?.venue ? venue.charAt(0).toUpperCase() : '?');
	let homeTeam = $derived(['HOME', 'NEUTRAL'].includes(venue) ? match.team : match.opponent);
	let awayTeam = $derived(['AWAY'].includes(venue) ? match.team : match.opponent);

	let matchDateString = $derived(
		match.schedule?.matchOn ? matchDate(match.schedule.matchOn) : 'TBC',
	);
</script>

{#snippet teamBadge(team: MatchTeam | MatchOpponent | undefined | null)}
	{#if team}
		<img src={team.badge} alt={team.club} class="mx-auto size-12 flex-none bg-white object-cover" />
	{:else}
		<div class="mx-auto size-12 flex-none bg-white object-cover"></div>
	{/if}
{/snippet}

{#snippet teamName(team: MatchTeam | MatchOpponent | undefined | null)}
	{#if team}
		<div class="flex-grow text-center">
			<p
				class="overflow-hidden text-center text-xs font-medium text-ellipsis whitespace-nowrap text-gray-900"
			>
				{team.club}
			</p>
			<p class="overflow-hidden text-xs font-medium text-ellipsis text-gray-900">
				{team.squad}
			</p>
		</div>
	{:else}
		<div class="text-center text-xs/6 font-medium text-gray-900"></div>
	{/if}
{/snippet}

{#snippet matchSchedule()}
	<div class=" bg-slate-200 p-2">
		<div class="truncate text-sm text-gray-900">
			{socialDate(match.schedule?.matchOn ?? 'TBC')}

			({venueLetter})
		</div>
	</div>
{/snippet}

<div
	class="h-full max-w-64 items-baseline divide-y divide-slate-400 overflow-hidden rounded-lg border border-slate-400 shadow-sm"
>
	<div class="flex h-28 items-center justify-center bg-white p-2">
		<div class="grid grid-cols-7 gap-2 bg-white p-2">
			<div class="col-span-3 grid grid-cols-1">
				{@render teamBadge(homeTeam)}
				{@render teamName(homeTeam)}
			</div>
			<div class="grid grid-cols-1 items-center justify-center">
				<p class="text-center text-2xl font-medium text-slate-700">vs</p>
			</div>
			<div class="col-span-3 grid grid-cols-1">
				{@render teamBadge(awayTeam)}
				{@render teamName(awayTeam)}
			</div>
		</div>
	</div>
	{@render matchSchedule()}
	<div class="flex gap-x-2 bg-slate-300 p-2">
		{#if match.team}
			<FortIcon class="size-4 text-slate-500" />
		{:else}
			<FortIcon class="size-4 text-slate-200" />
		{/if}
		{#if match.opponent}
			<SwordIcon class="size-4 text-slate-500" />
		{:else}
			<SwordIcon class="size-4 text-slate-200" />
		{/if}

		{#if match.detail}
			<StadiumIcon class="size-4 text-slate-500" />
		{:else}
			<StadiumIcon class="size-4 text-slate-200" />
		{/if}
		{#if match.schedule}
			<CalendarIcon class="size-4 text-slate-500" />
		{:else}
			<CalendarIcon class="size-4 text-slate-200" />
		{/if}
	</div>
</div>
