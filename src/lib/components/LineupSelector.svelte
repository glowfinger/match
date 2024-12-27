<script lang="ts">
	import { SHIRT_NUMBERS } from '$lib/counts/PlayerCounts';
	import type { MatchPosition, Player } from '$lib/database/IndexedDB';
	import MatchPositionCard from './cards/MatchPositionCard.svelte';

	type Props = {
		players: Player[];
		matchPositions: MatchPosition[];
	};

	let { players = [], matchPositions = [] }: Props = $props();

	function getPlayerByPosition(position: string): Player | null {
		const found =
			matchPositions.find(
				(matchPosition) => matchPosition.position === position && matchPosition.type === 'start',
			)?.playerKey ?? null;

		return players.find((player) => player.key === found) ?? null;
	}
</script>

<div class="grid grid-cols-1 gap-2">
	{#each [...SHIRT_NUMBERS] as [positionNumber, positionName]}
		<MatchPositionCard
			{positionNumber}
			{positionName}
			player={getPlayerByPosition(positionNumber)}
		/>
	{/each}
</div>
