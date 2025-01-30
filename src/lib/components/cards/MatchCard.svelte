<script lang="ts">
	import type { Match } from '$lib/database/IndexedDB';

	type Props = {
		match: Match;
	};

	let { match }: Props = $props();

	function isNewMatch() {
		return Object.keys(match).length === 3;
	}

	function hasNoTeams() {
		return !match.team && !match.opponent;
	}
</script>

{#snippet noTeams()}
	<div class="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-2">No team set</div>
{/snippet}

<div class="overflow-hidden border border-slate-500">
	<a href={`/match/${match.id}`} class="focus:outline-none">
		{#if hasNoTeams()}
			{@render noTeams()}
		{:else if match.detail && match.detail.venue === 'AWAY'}
			<div class="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-2">
				{#if match.opponent}
					<img
						src={match.opponent.badge}
						alt={match.opponent.club}
						class="size-12 flex-none bg-white object-cover"
					/>

					<div class="text-sm/6 font-medium text-gray-900">
						{match.opponent.club}
						{match.opponent.squad}
					</div>
				{:else}
					<div class="text-sm/6 font-medium text-gray-900">-</div>
				{/if}

				<p class="text-lg">v</p>

				{#if match.team}
					<div class="text-sm/6 font-medium text-gray-900">
						{match.team.club}
						{match.team.squad}
					</div>
					<img
						src={match.team.badge}
						alt={match.team.club}
						class="relative size-12 flex-none object-cover"
					/>
				{:else}
					<div class="text-sm/6 font-medium text-gray-900">-</div>
				{/if}
			</div>
		{:else}
			<div class="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-2">
				{#if match.team}
					<img
						src={match.team.badge}
						alt={match.team.club}
						class="size-12 flex-none bg-white object-cover"
					/>

					<div class="text-sm/6 font-medium text-gray-900">
						{match.team.club}
						{match.team.squad}
					</div>
				{:else}
					<div class="text-sm/6 font-medium text-gray-900">-</div>
				{/if}

				<p class="text-lg">v</p>

				{#if match.opponent}
					<div class="text-sm/6 font-medium text-gray-900">
						{match.opponent.club}
						{match.opponent.squad}
					</div>
					<img
						src={match.opponent.badge}
						alt={match.opponent.club}
						class="relative size-12 flex-none bg-white object-cover"
					/>
				{:else}
					<div class="text-sm/6 font-medium text-gray-900">-</div>
				{/if}
			</div>
			{#if match.detail}
				<div
					class="flex items-center gap-x-4 border-b border-t border-slate-900/5 bg-slate-200 p-2"
				>
					<div class="truncate text-sm/6 font-medium text-gray-900">
						Details: {match.detail.type}, {match.detail.venue}, {match.detail.address}
					</div>
				</div>
			{/if}
			{#if match.schedule}
				<div
					class="flex items-center gap-x-4 border-b border-t border-slate-900/5 bg-slate-200 p-2"
				>
					<div class="text-sm/6 font-medium text-gray-900">
						Date: {match.schedule.matchOn}, Meet: {match.schedule.meetAt}, K/O: {match.schedule
							.kickOffAt}
					</div>
				</div>
			{/if}
		{/if}
	</a>
</div>
