<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import LinkCard from '$lib/components/cards/LinkCard.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import type { LayoutProps } from '../$types';
	import { ADMIN_LINKS, matchIdMapper } from '../MatchLinks';

	let props: LayoutProps = $props();
	let matchId = props.data.matchId;
	let matchTile = props.data.matchTile;

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: matchTile, href: `/match/${matchId}` },
	];

	let adminLinks = ADMIN_LINKS.map((link) => matchIdMapper(matchId, link));
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Match admin</HeadingLg>

<ul role="list" class="grid grid-cols-4 gap-2">
	{#each adminLinks as link}
		<LinkCard {link} />
	{/each}
</ul>
