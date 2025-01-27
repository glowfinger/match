<script lang="ts">
	import type { Match } from '$lib/database/IndexedDB';

	type Props = {
		match: Match;
	};

	let { match }: Props = $props();

	function isNewMatch() {
		return Object.keys(match).length === 3;
	}
</script>

<div class="overflow-hidden rounded-b-2xl border border-slate-500">
	<a href={`/match/${match.id}`} class="focus:outline-none">
		{#if isNewMatch()}
			<div class="flex items-center gap-x-4 border-b bg-slate-500 p-2">
				<div class="text-sm/6 font-medium text-gray-900">New Match</div>
			</div>
		{:else}
			<div class="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-2">
				{#if match.team}
					<img
						src={match.team.badge}
						alt="Reform"
						class="size-12 flex-none rounded-lg border border-gray-900 bg-white object-cover"
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
						alt="Reform"
						class="relative size-12 flex-none rounded-lg bg-white object-cover"
					/>
				{:else}
					<div class="text-sm/6 font-medium text-gray-900">-</div>
				{/if}
			</div>

			{#if match.schedule}
				<div
					class="flex items-center gap-x-4 border-b border-t border-slate-900/5 bg-slate-200 p-2"
				>
					<div class="text-sm/6 font-medium text-gray-900">Date: {match.schedule.matchOn}</div>
				</div>
			{/if}
		{/if}
	</a>
</div>
