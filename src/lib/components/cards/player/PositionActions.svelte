<script lang="ts">
	import CardButton from '$lib/components/CardButton.svelte';
	import type { MatchPosition, Player } from '$lib/database/IndexedDB';
	import { isStarting } from '$lib/helpers/SelectionPredicate';

	type Props = {
		player: Player;
		handleStart: () => void;

		matchPositions: MatchPosition[];
		matchId: number;
		position: string;
	};

	let { player, handleStart, matchPositions, matchId, position }: Props = $props();

	let hasStart = $state(false);

	let startPosition = $state<string | undefined>(undefined);
	let startSamePosition = $state(false);

	$effect(() => {
		startPosition =
			matchPositions.find(
				(matchPosition) => matchPosition.playerKey === player.key && matchPosition.type === 'start',
			)?.position ?? undefined;
		hasStart = isStarting(matchPositions, matchId, player.key);

		startSamePosition = startPosition === position;
	});
</script>

{#if startSamePosition}
	<div class="justify-between space-x-2 bg-green-600 px-2 text-slate-100">
		Already selected for this position
	</div>
	<CardButton onClick={handleStart}>Bench</CardButton>
{:else if hasStart}
	<div class="justify-between space-x-2 bg-slate-600 px-2 text-slate-100">
		Already starting at {startPosition}
	</div>
	<CardButton onClick={handleStart}>Move to {position}</CardButton>
{:else}
	<div class="justify-between space-x-2 bg-slate-400 px-2 text-slate-800">On bench</div>
	<CardButton onClick={handleStart} active={hasStart}>Start</CardButton>
{/if}
