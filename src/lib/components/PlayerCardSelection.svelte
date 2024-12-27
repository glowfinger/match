<script lang="ts">
	import { POSITION_NAMES } from '$lib/counts/PlayerCounts';
	import type { Player } from '$lib/database/IndexedDB';
	import PlayerAvatar from './avatars/PlayerAvatar.svelte';

	type Props = {
		player: Player;
		children?: any;
	};

	let { player, children }: Props = $props();
</script>

<li
	class="rounded- col-span-1 divide-y divide-slate-200 border border-slate-800 bg-slate-50 shadow"
>
	<div class="flex w-full items-center justify-between space-x-2 p-2">
		<div class="flex-1 truncate">
			<div class="flex items-center space-x-3">
				<h3 class="truncate text-sm font-medium text-slate-900">
					{player.bio.first}
					{player.bio.last}
				</h3>
				<span
					class="inline-flex shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
					>{player.bio.age}</span
				>
			</div>
			<p class="mt-1 truncate text-sm text-slate-500">
				{POSITION_NAMES.get(player.positions.main)}
			</p>
		</div>
		<PlayerAvatar {player} />
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
						class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-slate-900"
					>
						<svg
							class="size-5 text-slate-400"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
							data-slot="icon"
						>
							<path
								d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z"
							/>
							<path
								d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z"
							/>
						</svg>
						View
					</a>
				</div>
			</div>
		</div>
	{/if}
</li>
