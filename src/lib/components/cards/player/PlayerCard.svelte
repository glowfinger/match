<script lang="ts">
	import { POSITION_NAMES } from '$lib/counts/PlayerCounts';
	import type { Player } from '$lib/database/IndexedDB';
	import type { Snippet } from 'svelte';
	import PlayerPositionIndicator from './PlayerPositionIndicator.svelte';

	type Props = {
		player: Player;
		children?: Snippet;
		position?: string;
	};

	let { player, children, position = '' }: Props = $props();

	let imageUrl = $state('');

	$effect(() => {
		if (player && player.images?.length > 0) {
			imageUrl = `https://glowfinger.blob.core.windows.net/smg/thumbnails-260x260/${player.images[0].url}.png`;
		}
	});
</script>

{#snippet cardPlayerImage(player: Player)}
	{#if player && player.images?.length > 0}
		<div class="col-start-1 row-start-1 -mt-4 pl-8">
			<img
				class="size-36"
				src={imageUrl}
				alt="Player image {player.bio.screen}"
				aria-label="Player image {player.bio.screen}"
			/>
		</div>
	{:else}
		<div class="col-start-1 row-start-1 -mt-6 pl-8">
			<div class="size-36"></div>
		</div>
	{/if}
{/snippet}

{#snippet cardPlayerName(player: Player)}
	<div class="col-start-1 row-start-1 pt-6 pl-42">
		<p
			class="overflow-hidden text-2xl font-semibold text-ellipsis whitespace-nowrap text-white text-shadow-sm/30"
		>
			{player.bio.first}
		</p>
		<p
			class="-mt-1 overflow-hidden text-4xl font-bold text-ellipsis whitespace-nowrap text-yellow-600 text-shadow-sm/30"
		>
			{player.bio.last}
		</p>
		<span
			class="inline-flex items-center rounded-full bg-slate-300 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-700/10 ring-inset"
			>{POSITION_NAMES.get(player.positions.main)}</span
		>
	</div>
{/snippet}

<div class="pt-4">
	<div class=" grid grid-cols-1">
		<div
			class="col-start-1 row-start-1 h-auto w-full rounded-t border-b border-slate-800 bg-slate-500"
		></div>
		{@render cardPlayerImage(player)}

		{#if position}
			<div class="col-start-1 row-start-1 mt-8 ml-4 size-24">
				<span class=" text-7xl font-medium text-slate-100 text-shadow-sm/30">
					{position}
				</span>
			</div>
		{:else}
			<div class="col-start-1 row-start-1 mt-8 ml-4 size-24">
				<PlayerPositionIndicator {player} />
			</div>
		{/if}
		{@render cardPlayerName(player)}

		{#if children}
			{@render children()}
		{:else}
			<a
				href={`/players/profile/${player.key}`}
				class="w-full rounded-b bg-slate-700 p-4 font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
				>View player profile</a
			>{/if}
	</div>
</div>
