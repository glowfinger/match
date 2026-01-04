<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { MediaImageTypes, type MediaImageType } from '$lib/Constants';
	import { type MatchImage } from '$lib/database/IndexedDB';
	import { getImagesByMatch } from '$lib/database/match/MatchImageDBService';
	import { onMount } from 'svelte';
	import type { LayoutProps } from '../../$types';

	let props: LayoutProps = $props();
	let matchId = props.data.matchId;
	let matchTile = props.data.matchTile;
	let images: MatchImage[] = $state([]);

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: matchTile, href: `/match/${matchId}` },
		{ name: 'Images', href: `/match/${matchId}/images` },
	];

	onMount(async () => {
		const promise = Promise.all([getImagesByMatch(matchId)]);
		[images] = await promise;
	});

	function hasBeenSelected(type: MediaImageType) {
		return images.filter((image) => image.type === type.type).length > 0;
	}

	function notSelected(type: MediaImageType) {
		return images.filter((image) => image.type === type.type).length === 0;
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Add media</HeadingLg>
<HeadingMd>Unselescted</HeadingMd>

<div class="grid grid-cols-2 gap-4">
	{#each MediaImageTypes.filter(notSelected) as type}
		<div class="flex items-center justify-between">
			<p>{type.label}</p>
			<a class="btn" href={`/match/${matchId}/media/${type.type}`}>Generate</a>
		</div>
	{/each}
</div>

<HeadingMd>Selescted</HeadingMd>
{#each MediaImageTypes.filter(hasBeenSelected) as type}
	<div class="flex items-center justify-between">
		<p>{type.label}</p>
		<button class="btn" onclick={() => {}}>Generate</button>
	</div>
{/each}
