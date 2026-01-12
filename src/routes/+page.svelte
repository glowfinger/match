<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import MatchCard from '$lib/components/cards/MatchCard.svelte';
	import { addMatch, getMatches } from '$lib/database/MatchService';
	import type { Match } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { goto } from '$app/navigation';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { sortByDate } from '$lib/utils/sorts/ClubSort';
	import CONFIG from '$lib/constants/FeatureConfig';

	let matches: Match[] = $state([]);

	onMount(async () => {
		const allMatches = await getMatches().then((matches) => matches.toSorted(sortByDate));

		const teams = [
			...new Set(allMatches.map((match) => [match.team?.club, match.team?.squad].join('-'))),
		];

		matches = allMatches
			.toSorted(sortByDate)
			.filter((match) => {
				const team = [match.team?.club, match.team?.squad].join('-');
				return teams.includes(team);
			})
			.slice(0, 4);
	});

	async function handleNewMatch() {
		const data = { createdAt: new Date().toISOString(), userAgent: navigator.userAgent };

		const { id } = await addMatch(data.createdAt, data.userAgent);
		goto(`/match/${id}`);
	}

	const breadcrumbs = [{ name: 'Home', href: '/' }];
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Match manager</HeadingLg>
<Button onclick={handleNewMatch}>Add New match</Button>

{#if CONFIG.EVENT_ENABLED}
	<a
		href="/events"
		class="border border-transparent bg-slate-800 px-4 py-2 text-center text-sm text-white shadow-md transition-all hover:bg-slate-700 hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
		>View events</a
	>
{/if}

<HeadingMd>Latest</HeadingMd>
<Button href="/matches" class="variant-filled-primary btn">View matches</Button>

<div class="grid grid-cols-2 gap-2">
	{#each matches.toSorted(sortByDate) as match}
		<a href={`/match/${match.id}`} class="focus:outline-hidden">
			<MatchCard {match} />
		</a>
	{/each}
</div>

<Separator />
<HeadingMd>Players</HeadingMd>
<a href="/players" class="variant-filled-primary btn">View player</a>
<Separator />
<HeadingMd>Admin</HeadingMd>
<a href="/admin" class="variant-filled-primary btn">Admin</a>
