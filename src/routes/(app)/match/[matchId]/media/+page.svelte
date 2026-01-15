<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import type { MatchImage } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { MediaImageTypes, type MediaImageType } from '$lib/Constants';
	import type { LayoutProps } from '../$types';
	import { getImagesByMatch } from '$lib/database/match/MatchImageDBService';
	import { MATCH_MEDIA_IMAGE_LINKS, matchIdMapper } from '../MatchLinks';
	import LinkCard from '$lib/components/cards/LinkCard.svelte';

	let props: LayoutProps = $props();
	let matchId = props.data.matchId;
	let matchTile = props.data.matchTile;

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: matchTile, href: `/match/${matchId}` },
		{ name: 'Media', href: `/match/${matchId}/media` },
	];

	let images: MatchImage[] = $state([]);
	let matchMediaImageLinks = MATCH_MEDIA_IMAGE_LINKS.map((link) => matchIdMapper(matchId, link));

	onMount(async () => {
		images = await getImagesByMatch(matchId);
	});

	function getImages(type: string) {
		return images.filter((image) => image.type === type);
	}

	function getGeneratedImageTypes() {
		return MediaImageTypes.filter((type) => getImages(type.type).length > 0);
	}

	function hasBeenSelected(type: MediaImageType) {
		return images.filter((image) => image.type === type.type).length > 0;
	}

	function notSelected(type: MediaImageType) {
		return images.filter((image) => image.type === type.type).length === 0;
	}
</script>

<Breadcrumb {breadcrumbs} />

<ul role="list" class="grid grid-cols-4 gap-2">
	{#each matchMediaImageLinks as link}
		<LinkCard {link} />
		<div class="col-span-3 overflow-hidden rounded-lg border border-slate-900 bg-slate-300">
			<div class="grid grid-cols-4">
				{#each getImages(link?.type ?? '') as image}
					<img class="h-24 w-24 object-cover" src={image.base64} alt={image.type} />
				{/each}
			</div>
		</div>
	{/each}
</ul>
