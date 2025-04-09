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
</li>
