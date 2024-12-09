<script lang="ts">
	import { countFrontRow, countHookers, countProps } from '$lib/counts/PlayerCounts';
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
<dl class="grid grid-cols-4 gap-2">
	<Stat title="All" value={countPlayers()} />
	<Stat title="Front row" value={countFrontRow(players)} />
	<Stat title="Props" value={countProps(players)} />
	<Stat title="Hookers" value={countHookers(players)} />
</dl>
