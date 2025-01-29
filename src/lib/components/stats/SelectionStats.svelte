<script lang="ts">
	import type { Player, Selection } from '$lib/database/IndexedDB';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import Stat from './Stat.svelte';
	import { goto } from '$app/navigation';

	type Props = {
		players: Player[];
		selections: Selection[];
		search: SvelteURLSearchParams;
	};

	let { players = [], selections = [], search = $bindable() }: Props = $props();

	function countPlayers() {
		return players.filter((p) => !selections.some(({ playerKey }) => playerKey === p.key)).length;
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

	function toggleFilters(key: string) {
		const AVAILABLE = 'available';
		search.has(AVAILABLE, key) ? search.delete(AVAILABLE, key) : search.append(AVAILABLE, key);
		goto(`?${search.toString()}`);
	}

	function isFilterActive(key: string) {
		return search.has('available', key);
	}
</script>

<dl class="grid grid-cols-4 gap-2">
	<button onclick={() => toggleFilters('UNANSWERED')}>
		<Stat title="Unanswered" value={countPlayers()} active={isFilterActive('UNANSWERED')} />
	</button>
	<button onclick={() => toggleFilters('YES')}>
		<Stat title="Yes" value={countYes()} active={isFilterActive('YES')} />
	</button>
	<button onclick={() => toggleFilters('NO')}>
		<Stat title="No" value={countNo()} active={isFilterActive('NO')} />
	</button>
	<button onclick={() => toggleFilters('MAYBE')}>
		<Stat title="Maybe" value={countMaybe()} active={isFilterActive('MAYBE')} />
	</button>
</dl>
