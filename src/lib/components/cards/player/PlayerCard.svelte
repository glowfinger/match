<script lang="ts">
	import PlayerAvatar from '$lib/components/avatars/PlayerAvatar.svelte';
	import { POSITION_NAMES } from '$lib/counts/PlayerCounts';
	import type { Player } from '$lib/database/IndexedDB';
	import PlayerPositionIndicator from './PlayerPositionIndicator.svelte';

	type Props = {
		player: Player;
	};

	let { player }: Props = $props();
</script>

<div
	class="grid items-center rounded-full border border-slate-300 bg-white shadow-xs focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-slate-400"
>
	<div class="col-start-1 row-start-1 m-2 h-12">
		<PlayerPositionIndicator {player} />
	</div>
	<div class="col-start-1 row-start-1">
		{#if player && player.images?.length > 0}
			<div>
				<img
					class="size-18 rounded-full border border-slate-400 bg-slate-100"
					src={`https://glowfinger.blob.core.windows.net/smg/thumbnails-260x260/${player.images[0].url}.png`}
					alt=""
				/>
			</div>
		{:else}
			<div class="size-18 rounded-full border border-slate-200 bg-slate-100"></div>
			<!-- <PlayerAvatar {player} /> -->
		{/if}
	</div>
	<div class="col-start-1 row-start-1 grid grid-cols-1 pt-4 pl-16">
		<p class="text-md font-semibold">{player.bio.first}</p>
		<p class="-mt-1 text-lg font-bold">{player.bio.last}</p>
	</div>
</div>
