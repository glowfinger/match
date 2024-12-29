<script lang="ts">
	import type { Match } from '$lib/database/IndexedDB';

	type Props = {
		match: Match;
	};

	let { match }: Props = $props();
</script>

<div
	class="relative flex items-center space-x-2 rounded-lg border border-slate-300 bg-white p-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-slate-400"
>
	<!-- <div class="shrink-0">
		<img
			class="size-10 rounded-full"
			src={`https://glowfinger.blob.core.windows.net/smg/other-badges/bream.jpg`}
			alt=""
		/>
	</div> -->
	<div class="min-w-0 flex-1">
		<a href={`/match/${match.id}`} class="focus:outline-none">
			<span class="absolute inset-0" aria-hidden="true"></span>
			<p class="text-sm font-medium text-slate-900">{match.team}</p>
			<p class="truncate text-sm text-slate-500">{match.matchOn}</p>
			<p class="truncate text-sm text-slate-500">{match.squad}</p>
		</a>
	</div>
</div>
