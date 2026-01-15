<script lang="ts">
	import { onMount } from 'svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import MatchCard from '$lib/components/cards/MatchCard.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import LinkCard from '$lib/components/cards/LinkCard.svelte';
	import { getImagesByMatch } from '$lib/database/match/MatchImageDBService';
	import type { MatchImage } from '$lib/database/IndexedDB';
	import type { LayoutProps } from './$types';
	import { INFO_LINKS, MANAGE_LINKS, matchIdMapper } from './MatchLinks';

	let props: LayoutProps = $props();
	let matchId = props.data.matchId;
	let matchTile = props.data.matchTile;
	let match = props.data.match;

	let images: MatchImage[] = $state([]);

	onMount(async () => {
		images = await getImagesByMatch(matchId);
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: matchTile, href: `/match/${matchId}` },
	];

	const manageLinks = MANAGE_LINKS.map((link) => matchIdMapper(matchId, link));
	const infoLinks = INFO_LINKS.map((link) => matchIdMapper(matchId, link));
</script>

<Breadcrumb {breadcrumbs} />

<Separator />
<MatchCard {match} />
<Separator />
<HeadingMd>Info</HeadingMd>
<ul role="list" class="grid grid-cols-4 gap-2">
	{#each infoLinks as link}
		<LinkCard {link} />
	{/each}
</ul>
<Separator />
<HeadingMd>Manage</HeadingMd>
<ul role="list" class="grid grid-cols-4 gap-2">
	{#each manageLinks as link}
		<LinkCard {link} />
	{/each}
</ul>
