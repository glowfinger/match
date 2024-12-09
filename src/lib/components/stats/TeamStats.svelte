<script lang="ts">
	import {
		countBackRow,
		countBlindSide,
		countFrontRow,
		countHookers,
		countNo8,
		countOpenSide,
		countProps,
		countSecondRow,
	} from '$lib/counts/PlayerCounts';
	import type { Player, Position, Selection } from '$lib/IndexedDB';
	import Stat from './Stat.svelte';

	type Props = {
		players: Player[];
	};

	let { players = [] }: Props = $props();

	function countPlayers() {
		return players.length;
	}
</script>

<h2 class="h2">Stats</h2>
<div class="grid grid-cols-1 gap-2">
	<dl class="grid grid-cols-4 gap-2">
		<Stat title="All" value={countPlayers()} />
	</dl>

	<dl class="grid grid-cols-4 gap-2">
		<Stat title="Front row" value={countFrontRow(players)} />
		<Stat title="Props" value={countProps(players)} />
		<Stat title="Hookers" value={countHookers(players)} />
	</dl>

	<dl class="grid grid-cols-4 gap-2">
		<Stat title="2nd row" value={countSecondRow(players)} />
	</dl>

	<dl class="grid grid-cols-4 gap-2">
		<Stat title="Back row" value={countBackRow(players)} />
		<Stat title="Blind side" value={countBlindSide(players)} />
		<Stat title="Openside" value={countOpenSide(players)} />
		<Stat title="No. 8" value={countNo8(players)} />
	</dl>
</div>
