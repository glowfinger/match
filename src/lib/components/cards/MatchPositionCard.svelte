<script lang="ts">
	import type { Player } from '$lib/IndexedDB';

	type Props = {
		positionName: string;
		positionNumber: string;
		player: Player | undefined | null;
	};

	let { positionName, positionNumber, player }: Props = $props();
</script>

<div
	class="relative flex items-center space-x-2 rounded-lg border border-slate-300 bg-white p-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-slate-400"
>
	<div class="shrink-0">
		<span class="inline-flex size-10 items-center justify-center rounded-full bg-slate-500">
			<span class="font-bold text-white">{positionNumber}</span>
		</span>
	</div>

	{#if player}
		<div class="shrink-0">
			<img
				class="size-10 rounded-full"
				src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				alt=""
			/>
		</div>
	{:else}
		<div class="shrink-0">
			<span
				class="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100"
			>
				<span class="font-bold text-white"></span>
			</span>
		</div>
	{/if}
	<div class="min-w-0 flex-1">
		<a href="/match/1/lineup/position/{positionNumber}" class="focus:outline-none">
			<span class="absolute inset-0" aria-hidden="true"></span>
			{#if player}
				<p class="text-sm font-medium text-slate-900">{player.bio.first} {player.bio.last}</p>
			{:else}
				<p class="truncate text-sm text-slate-900">Select player</p>
			{/if}
			<p class="truncate text-sm text-slate-500">{positionName}</p>
		</a>
	</div>
</div>
