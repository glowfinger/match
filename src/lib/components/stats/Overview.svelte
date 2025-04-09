<script lang="ts">
	import type { Note } from '$lib/database/Notes';

	type Props = {
		notes: Note[];
		grid: Stat[];
	};

	type Stat = {
		channel: string;
		zone: string;
		team: string;
		kept: number;
		lost: number;
		count: number;
		times: number[];
	};

	let { notes, grid }: Props = $props();

	let totalRucks = notes.filter((note) => note.ruck !== undefined).length;

	let ownRucks = notes.filter((note) => note.ruck !== undefined && note.ruck.team === 'own');

	let ownRucksWon = notes.filter(
		(note) => note.ruck !== undefined && note.ruck.team === 'own' && note.ruck.outcome === 'kept',
	).length;

	let ownRucksLost = notes.filter(
		(note) => note.ruck !== undefined && note.ruck.team === 'own' && note.ruck.outcome === 'lost',
	).length;

	const ownRuckPercentage = Math.round(
		ownRucks.length > 0 ? (ownRucksWon / ownRucks.length) * 100 : 0,
	);

	let oppositionRucks = notes.filter(
		(note) => note.ruck !== undefined && note.ruck.team === 'opponent',
	);

	let oppositionRucksWon = notes.filter(
		(note) =>
			note.ruck !== undefined && note.ruck.team === 'opponent' && note.ruck.outcome === 'won',
	).length;

	let oppositionRucksLost = notes.filter(
		(note) =>
			note.ruck !== undefined && note.ruck.team === 'opponent' && note.ruck.outcome === 'kept',
	).length;

	const oppositionRuckPercentage = Math.round(
		oppositionRucks.length > 0 ? (oppositionRucksLost / oppositionRucks.length) * 100 : 0,
	);

	const totalLineouts = notes.filter((note) => note.lineout !== undefined).length;

	const ownLineouts = notes.filter(
		(note) => note.lineout !== undefined && note.lineout.team === 'own',
	).length;

	const oppositionLineouts = notes.filter(
		(note) => note.lineout !== undefined && note.lineout.team === 'opponent',
	).length;

	const ownLineoutsWon = notes.filter(
		(note) =>
			note.lineout !== undefined && note.lineout.team === 'own' && note.lineout.outcome === 'won',
	).length;

	const ownLineoutsLost = notes.filter(
		(note) =>
			note.lineout !== undefined && note.lineout.team === 'own' && note.lineout.outcome === 'lost',
	).length;

	const oppositionLineoutsWon = notes.filter(
		(note) =>
			note.lineout !== undefined &&
			note.lineout.team === 'opponent' &&
			note.lineout.outcome === 'won',
	).length;

	const oppositionLineoutsLost = notes.filter(
		(note) =>
			note.lineout !== undefined &&
			note.lineout.team === 'opponent' &&
			note.lineout.outcome === 'lost',
	).length;

	const ownLineoutPercentage = Math.round(
		ownLineouts > 0 ? (ownLineoutsWon / ownLineouts) * 100 : 0,
	);

	const oppositionLineoutPercentage = Math.round(
		oppositionLineouts > 0 ? (oppositionLineoutsWon / oppositionLineouts) * 100 : 0,
	);

	const stats = [
		{ title: 'Total rucks', value: totalRucks },
		{ title: 'Chipstead rucks', value: ownRucks.length },
		{ title: 'Chipstead rucks won', value: ownRucksWon },
		{ title: 'Chipstead rucks lost', value: ownRucksLost },
		{ title: 'Chipstead ruck retention %', value: ownRuckPercentage },
		{ title: 'PJF rucks', value: oppositionRucks.length },
		{ title: 'PJF rucks won', value: oppositionRucksWon },
		{ title: 'PJF rucks lost', value: oppositionRucksLost },
		{ title: 'PJF ruck retention %', value: oppositionRuckPercentage },
	];

	const zoneNames = ['A', 'B', 'C', 'D'];

	const zones = ['1', '2', '3', '4'].reverse();
	const channels = ['1', '2', '3', '4', '5'];
</script>

{#each zones as zone, i}
	{#each channels as channel}
		{@const stat = grid.find((stat: Stat) => stat.zone === zone && stat.channel === channel)}

		{#if stat}
			<div class="text-green-950">
				<p>{zoneNames[i]}{channel}: {stat.kept}/{stat.lost}</p>
				<!-- Z{stat.zone}C{stat.channel}
				T{stat.count}/K{stat.kept}/ -->

				<!-- {#if stat.lost > 0}
					<span class="font-bold text-red-950">L{stat.lost}</span>
				{:else}
					L{stat.lost}
				{/if} -->
			</div>
		{:else}
			<p>{zoneNames[i]}{channel}: 0/0</p>
		{/if}
	{/each}
{/each}

{#each stats as { title, value }}
	<p>{title}: {value}</p>
{/each}
