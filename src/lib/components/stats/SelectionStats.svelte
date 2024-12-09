<script lang="ts">
	import type { Player, Selection } from '$lib/IndexedDB';
	import Stat from './Stat.svelte';

	type Props = {
		players: Player[];
		selections: Selection[];
	};

	let { players = [], selections = [] }: Props = $props();

	function countPlayers() {
		return players.length;
	}

	function countYes() {
		return selections.filter((s) => s.available === 'yes').length;
	}

	function countMaybe() {
		return selections.filter((s) => s.available === 'maybe').length;
	}

	function countNo() {
		return selections.filter((s) => s.available === 'no').length;
	}
</script>

<h2 class="h2">Stats</h2>
<dl class="grid grid-cols-4 gap-2">
	<Stat title="All" value={countPlayers()} />
	<Stat title="Yes" value={countYes()} />
	<Stat title="No" value={countNo()} />
	<Stat title="Maybe" value={countMaybe()} />
</dl>
