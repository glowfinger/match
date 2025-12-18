<script lang="ts">
	import { SHIRT_NUMBERS } from '$lib/counts/PlayerCounts';
	import type { Player } from '$lib/database/IndexedDB';

	type Props = {
		player: Player;
	};

	let { player }: Props = $props();

	const INNER_CIRCLE_RADIUS = 3;
	const OUTER_CIRCLE_RADIUS = 4;

	const POSITIONS = [
		{ x: 6, y: 6, shirtNumber: '1' },
		{ x: 16, y: 6, shirtNumber: '2' },
		{ x: 26, y: 6, shirtNumber: '3' },
		{ x: 11, y: 14, shirtNumber: '4' },
		{ x: 21, y: 14, shirtNumber: '5' },
		{ x: 6, y: 22, shirtNumber: '6' },
		{ x: 26, y: 22, shirtNumber: '7' },
		{ x: 16, y: 24, shirtNumber: '8' },
		{ x: 11, y: 34, shirtNumber: '9' },
		{ x: 21, y: 34, shirtNumber: '10' },
		{ x: 6, y: 52, shirtNumber: '11' },
		{ x: 11, y: 44, shirtNumber: '12' },
		{ x: 21, y: 44, shirtNumber: '13' },
		{ x: 26, y: 52, shirtNumber: '14' },
		{ x: 16, y: 54, shirtNumber: '15' },
	];

	function isFavourite(player: Player, position: string): boolean {
		const positionName = SHIRT_NUMBERS.get(position);
		return player.positions.main === positionName;
	}

	function isOtherPosition(player: Player, position: string): boolean {
		const positionName = SHIRT_NUMBERS.get(position) ?? '';
		return player.positions.other.includes(positionName);
	}
</script>

{#snippet favouriteIcon(cy: number, cx: number)}
	<circle {cx} {cy} r={OUTER_CIRCLE_RADIUS} class="fill-yellow-800" />
	<circle {cx} {cy} r={INNER_CIRCLE_RADIUS} class="fill-yellow-500" />
{/snippet}

{#snippet otherIcon(cy: number, cx: number)}
	<circle {cx} {cy} r={OUTER_CIRCLE_RADIUS} class="fill-blue-500" />
	<circle {cx} {cy} r={INNER_CIRCLE_RADIUS} class="fill-blue-300" />
{/snippet}

{#snippet emptyIcon(cy: number, cx: number)}
	<circle {cx} {cy} r={OUTER_CIRCLE_RADIUS} class="fill-slate-300" />
	<circle {cx} {cy} r={INNER_CIRCLE_RADIUS} class="fill-slate-200" />
{/snippet}
<svg viewBox="0 0 32 62" class="h-full w-auto">
	{#each POSITIONS as position}
		{#if isFavourite(player, position.shirtNumber)}
			{@render favouriteIcon(position.y, position.x)}
		{:else if isOtherPosition(player, position.shirtNumber)}
			{@render otherIcon(position.y, position.x)}
		{:else}
			{@render emptyIcon(position.y, position.x)}
		{/if}
	{/each}
</svg>
