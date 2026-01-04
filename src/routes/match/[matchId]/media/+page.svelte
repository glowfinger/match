<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import type { MatchImage } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { MediaImageTypes, type MediaImageType } from '$lib/Constants';
	import type { LayoutProps } from '../$types';

	let props: LayoutProps = $props();
	let matchId = props.data.matchId;
	let matchTile = props.data.matchTile;

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
