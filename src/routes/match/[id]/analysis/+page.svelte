<script lang="ts">
	import { getMatch } from '$lib/database/MatchService';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import type { Match } from '$lib/database/IndexedDB';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import type { Note } from '$lib/database/Notes';
	import TestNotes from '$lib/constants/TestNotes';
	import pitchRender from '$lib/3d/geometry/PitchRender';
	import Overview from '$lib/components/stats/Overview.svelte';

	const matchId = Number.parseInt(page.params.id as string);

	let match: Match | undefined = $state();
	let notes: Note[] = $state([]);
	let canvas: HTMLCanvasElement | undefined = $state();
	let div: HTMLDivElement | undefined = $state();
	type Stat = {
		channel: string;
		zone: string;
		team: string;
		kept: number;
		lost: number;
		count: number;
		times: number[];
	};

	let stats: Stat[] = $state([]);

	const zones = ['1', '2', '3', '4'].reverse();
	const channels = ['1', '2', '3', '4', '5'];

	onMount(async () => {
		match = await getMatch(matchId);
		notes = TestNotes;
		stats = $state
			.snapshot(notes)
			.reduce(reducer, [])
			.toSorted(statSort)
			.filter((stat) => stat.team === 'own');
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: 'Analysis', href: `/match/${matchId}/analysis` },
	];

	$effect(() => {
		if (div !== undefined && canvas !== undefined && stats.length > 0) {
			pitchRender(canvas, div, $state.snapshot(stats));
		}
	});

	function reducer(acc: Stat[], note: Note) {
		if (!note.ruck && !note.zone) {
			return acc;
		}

		const index = acc.findIndex((stat: Stat) => {
			return (
				stat.channel === note.zone.channel &&
				stat.zone === note.zone.zone &&
				stat.team === note.ruck.team
			);
		});

		if (index === -1) {
			acc.push({
				channel: note.zone.channel,
				zone: note.zone.zone,
				team: note.ruck.team,
				count: 1,
				kept: note.ruck.outcome === 'kept' ? 1 : 0,
				lost: note.ruck.outcome === 'lost' ? 1 : 0,
				times: [note.endAt],
			});
		} else {
			acc[index].times.push(note.endAt);
			acc[index].count++;
			acc[index].kept += note.ruck.outcome === 'kept' ? 1 : 0;
			acc[index].lost += note.ruck.outcome === 'lost' ? 1 : 0;
		}

		return acc;
	}

	function statSort(a: Stat, b: Stat) {
		return (
			a.zone.localeCompare(b.zone) ||
			a.channel.localeCompare(b.channel) ||
			a.team.localeCompare(b.team)
		);
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Analysis</HeadingLg>
{#if !match}
	<p>Match not found</p>
{:else}
	<!-- <Overview {notes} grid={stats} /> -->
	<!-- <pre>{JSON.stringify(stats, null, 2)}</pre> -->
	<!-- <div class="grid w-full grid-cols-5 gap-2 bg-green-700">
		{#each zones as zone}
			{#each channels as channel}
				{@const stat = stats.find((stat: Stat) => stat.zone === zone && stat.channel === channel)}
				<div class="aspect-square bg-green-300">
					{#if stat}
						<div class="text-green-950">
							Z{stat.zone}C{stat.channel}
							T{stat.count}/K{stat.kept}/

							{#if stat.lost > 0}
								<span class="font-bold text-red-950">L{stat.lost}</span>
							{:else}
								L{stat.lost}
							{/if}
						</div>
					{:else}
						<div class="text-white">-</div>
					{/if}
				</div>
			{/each}
		{/each}
	</div> -->

	<div id="container" class="relative mb-6 aspect-square w-full bg-slate-400">
		<canvas bind:this={canvas} id="canvas" class="absolute w-full"></canvas>
		<div bind:this={div} class="relative h-full w-full"></div>
	</div>
{/if}
