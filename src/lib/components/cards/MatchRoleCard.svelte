<script lang="ts">
	import type { Player } from '$lib/database/IndexedDB';
	import PlayerAvatar from '../avatars/PlayerAvatar.svelte';
	import CardPlayerAvatar from './partials/CardPlayerAvatar.svelte';
	import CardPlayerPositon from './partials/CardPlayerPositon.svelte';

	type Props = {
		matchId: number;
		player?: Player | undefined | null;
		role: { value: string; label: string };
		to: string;
	};

	let { matchId, player, role, to }: Props = $props();
</script>

<div class="col-span-1 divide-y divide-gray-200 bg-white shadow">
	<a href={to} class="block hover:bg-gray-50">
		<div class="flex w-full items-center justify-between space-x-4 p-2">
			<div class="flex space-x-2">
				{#if player}
					<CardPlayerPositon {player} />
				{:else}
					<CardPlayerAvatar {player} />
				{/if}
			</div>

			<div class="flex-1 truncate">
				<div class="flex items-center space-x-3">
					{#if player}
						<h3 class="truncate text-sm font-medium text-gray-900">
							{player.bio.first}
							{player.bio.last}
						</h3>
					{:else}
						<h3 class="truncate text-sm font-medium text-gray-900">Select player</h3>
					{/if}
				</div>
				<p class="mt-1 truncate text-sm text-gray-500">{role.label}</p>
			</div>
		</div>
		<div class="h-1 w-full bg-slate-400"></div>
	</a>
</div>
