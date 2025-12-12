<script lang="ts">
	import { page } from '$app/state';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getMatch } from '$lib/database/MatchService';
	import type { Match, MatchImage } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { getImagesByMatch } from '$lib/database/match/MatchImageDBService';
	import { MediaImageTypes, type MediaImageType } from '$lib/Constants';
	import type { LayoutProps } from '../$types';
	import { goto } from '$app/navigation';

	let { data }: LayoutProps = $props();

	const { matchId, match, matchTile } = data;

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: matchTile, href: `/match/${matchId}` },
		{ name: 'Media', href: `/match/${matchId}/media` },
	];

	let images: MatchImage[] = $state([]);

	onMount(async () => {});

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
<HeadingLg>Media</HeadingLg>

<div class="grid grid-cols-2 gap-4">
	{#each MediaImageTypes.filter(notSelected) as type}
		<div class="flex items-center justify-between">
			<p>{type.label}</p>
			<a class="btn" href={`/match/${matchId}/media/${type.type}`}>Generate</a>
		</div>
	{/each}
</div>

{#each getGeneratedImageTypes() as type}
	<HeadingMd>{type.label}</HeadingMd>

	{#if getImages(type.type).length > 0}
		<div class="grid grid-cols-2">
			{#each getImages(type.type) as image}
				<a href={`/match/${matchId}/media/${type.type}`}>
					<img src={image.base64} alt={type.label} />
				</a>
			{/each}
		</div>
	{/if}
{:else}
	no images
{/each}
