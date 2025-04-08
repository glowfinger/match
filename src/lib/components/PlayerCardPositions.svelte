<script lang="ts">
	import { SHIRT_NUMBERS } from '$lib/counts/PlayerCounts';
	import type { Player } from '$lib/database/IndexedDB';

	type Props = { player: Player };

	let { player }: Props = $props();
</script>

<div class="p-2">
	{#each player.positions.other as position}
		<span
			class="mr-2 inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-700/10"
			>{position}</span
		>
	{/each}
</div>
