<script lang="ts">
	import type { Player } from '$lib/database/IndexedDB';
	import PlayerAvatar from '../avatars/PlayerAvatar.svelte';

	type Props = {
		player: Player;
	};

	let { player }: Props = $props();
</script>

<div
	class="relative flex items-center space-x-2 rounded-lg border border-slate-300 bg-white p-2 shadow-xs focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-slate-400"
>
	{#if player && player.images?.length > 0}
		<div class="shrink-0">
			<img
				class="size-10 rounded-full"
				src={`https://glowfinger.blob.core.windows.net/smg/thumbnails-260x260/${player.images[0].url}.png`}
				alt=""
			/>
		</div>
	{:else if player}
		<PlayerAvatar {player} />
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
		<span class="absolute inset-0" aria-hidden="true"></span>
		{#if player}
			<p class="text-sm font-medium text-slate-900">{player.bio.first} {player.bio.last}</p>
		{:else}
			<p class="truncate text-sm text-slate-900">Select player</p>
		{/if}
	</div>
</div>
