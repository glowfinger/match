<script lang="ts">
	import {
		countBackRow,
		countBackThree,
		countBlindSide,
		countCentres,
		countFlyHalves,
		countFrontRow,
		countFullBacks,
		countHalfBacks,
		countHookers,
		countInsideCentres,
		countNo8,
		countOpenSide,
		countOutsideCentres,
		countProps,
		countScrumHalves,
		countSecondRow,
		countWings,
	} from '$lib/counts/PlayerCounts';
	import type { Player, Position, Selection } from '$lib/database/IndexedDB';
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

	<dl class="grid grid-cols-4 gap-2">
		<Stat title="Half back" value={countHalfBacks(players)} />
		<Stat title="Scrum half" value={countScrumHalves(players)} />
		<Stat title="Fly half" value={countFlyHalves(players)} />
	</dl>

	<dl class="grid grid-cols-4 gap-2">
		<Stat title="Centres" value={countCentres(players)} />
		<Stat title="Inside centre" value={countInsideCentres(players)} />
		<Stat title="Outside centre" value={countOutsideCentres(players)} />
	</dl>

	<dl class="grid grid-cols-4 gap-2">
		<Stat title="Back three" value={countBackThree(players)} />
		<Stat title="Winger" value={countWings(players)} />
		<Stat title="Fullbacks" value={countFullBacks(players)} />
	</dl>
</div>
