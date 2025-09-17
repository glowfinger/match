<script lang="ts">
	import { POSITION_NAMES } from '$lib/counts/PlayerCounts';
	import type { Player, PlayerImage } from '$lib/database/IndexedDB';
	import PlayerAvatar from './avatars/PlayerAvatar.svelte';
	import PlayerCardPositions from './PlayerCardPositions.svelte';

	type Props = { player: Player; isSelected?: boolean; children?: any };

	let { player, children, isSelected = false }: Props = $props();

	let profileImage: PlayerImage | undefined = $state();

	$effect(() => {
		// if (player?.images && player?.images.length > 0) {
		// 	profileImage = player.images.find((image) => image.type === 'profile-front');
		// }
	});

	function hasProfileImage(player: Player): boolean {
		return player.images && player.images.length > 0;
	}

	function getProfileImage(player: Player): PlayerImage | undefined {
		if (hasProfileImage(player)) {
			return player.images.find((image) => image.type === 'profile-front');
		}
		return undefined;
	}
</script>

<li
	class=" relative isolate flex flex-col justify-end overflow-hidden border border-slate-800 bg-slate-500 px-2 pt-32 pb-4 dark:bg-gray-800"
>
	<!-- <p class="absolute inset-0 top-2 left-2 -z-20 text-6xl text-gray-300">15</p> -->

	{#if hasProfileImage(player)}
		<img
			src={getProfileImage(player)?.large}
			alt=""
			class="absolute inset-0 -z-10 size-full object-contain"
		/>
	{/if}

	<div
		class="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40 dark:from-black/80 dark:via-black/40"
	></div>
	<div
		class="absolute inset-0 -z-10 rounded-2xl ring-1 ring-gray-900/10 ring-inset dark:ring-white/10"
	></div>

	<h3 class="text-xlg/6 mt-4 font-semibold text-yellow-600 text-shadow-sm/30">
		<a href={`/players/profile/${player.key}`}>
			<span class="absolute inset-0"></span>
			{player.bio.first}
			{player.bio.last}
		</a>
	</h3>
	<div class="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm/6 text-gray-300">
		<p class="mr-8 truncate">{player.positions.main}</p>
		<div class="-ml-4 flex items-center gap-x-4">
			<svg viewBox="0 0 2 2" class="-ml-0.5 size-0.5 flex-none fill-white/50 dark:fill-gray-300/50">
				<circle r="1" cx="1" cy="1" />
			</svg>
			<div class="flex gap-x-2.5">
				<img
					src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
					alt=""
					class="size-6 flex-none rounded-full bg-white/10 dark:bg-gray-800/10"
				/>
				Michael Foster
			</div>
		</div>
	</div>
</li>
<!-- 
<li
	class="rounded- col-span-1 divide-y divide-slate-200 border border-slate-400 bg-slate-50 shadow-sm"
>
	{#if isSelected}
		<div
			class="flex w-full items-center justify-between space-x-2 bg-slate-600 px-2 text-slate-100"
		>
			Already starting
		</div>
	{/if}
	{#if player}
		<div class="relative h-24 border border-slate-800 bg-slate-500 text-white">
			{#if hasProfileImage(player)}
				<div
					class="absolute bottom-0 left-4 aspect-square h-20 bg-cover bg-center"
					style="background-image: url('{getProfileImage(player)?.large}')"
				></div>
			{/if}

			<div class="absolute right-2 bottom-2 bg-slate-900/40 p-2">
				<h2 class="text-2xl font-bold">{player.bio.first} {player.bio.last}</h2>
				<p class="text-md font-bold text-yellow-600">{player.positions.main}</p>
			</div>
		</div>
	{/if}

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
	<!-- <PlayerCardPositions {player} /> -->
