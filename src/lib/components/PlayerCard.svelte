<script lang="ts">
	import { POSITION_NAMES } from '$lib/counts/PlayerCounts';
	import type { Player } from '$lib/database/IndexedDB';
	import PlayerAvatar from './avatars/PlayerAvatar.svelte';
	import PlayerCardPositions from './PlayerCardPositions.svelte';

	type Props = {
		player: Player;
		isSelected?: boolean;
		children?: any;
	};

	let { player, children, isSelected = false }: Props = $props();
</script>

<li
	class="rounded- col-span-1 divide-y divide-slate-200 border border-slate-400 bg-slate-50 shadow"
>
	{#if isSelected}
		<div
			class="flex w-full items-center justify-between space-x-2 bg-slate-600 px-2 text-slate-100"
		>
			Already starting
		</div>
	{/if}

	<div class="flex w-full items-center justify-between space-x-2 bg-slate-200 p-2">
		<div class="flex-1 truncate">
			<div class="flex items-center space-x-1">
				<h3 class="truncate text-sm font-medium text-slate-900">
					{player.bio.first}
					{player.bio.last}
				</h3>

				{#if player.tags.homegrown}
					<span
						title="Homegrown"
						class="inline-flex shrink-0 items-center rounded-full bg-slate-50 px-1.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20"
						>🍟</span
					>
				{/if}

				{#if player.bio.age}
					<span
						class="inline-flex shrink-0 items-center rounded-full bg-slate-50 px-1.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20"
						>{player.bio.age}</span
					>
				{/if}
			</div>
			<p class="mt-1 truncate text-sm text-slate-500">
				{POSITION_NAMES.get(player.positions.main)}
			</p>

			<p class="mt-1 truncate text-sm text-slate-500">
				{player.key}
			</p>
		</div>

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
		{/if}
	</div>

	{#if children}
		<div class="-mt-px flex divide-x divide-slate-200">
			{@render children()}
		</div>
	{:else}
		<div>
			<div class="-mt-px flex divide-x divide-slate-200">
				<div class="flex w-0 flex-1">
					<a
						href={`/players/profile/${player.key}`}
						class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 border border-transparent p-2 text-sm font-semibold text-slate-900"
					>
						View profile
					</a>
				</div>
			</div>
		</div>
	{/if}
	<PlayerCardPositions {player} />
</li>
