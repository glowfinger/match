<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { MediaImageTypes } from '$lib/Constants';
	import { type MatchImage } from '$lib/database/IndexedDB';
	import { getImagesByMatchAndType } from '$lib/database/match/MatchImageDBService';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { LayoutProps } from '../../$types';
	import DrawIcon from '$lib/components/icons/DrawIcon.svelte';
	import LinkCard from '$lib/components/cards/LinkCard.svelte';

	let props: LayoutProps = $props();
	let matchId = props.data.matchId;
	let matchTile = props.data.matchTile;
	let match = props.data.match;

	const mediaType = props.params.mediaType as string;
	const mediaLabel = MediaImageTypes.find((m) => m.type === mediaType)?.label;

	if (!mediaLabel) {
		throw new Error('Media type is required');
	}

	let images: MatchImage[] = $state([]);
	let activeImageIndex: number | undefined = $state();

	onMount(async () => {
		[images] = await Promise.all([getImagesByMatchAndType(matchId, mediaType)]);

		if (images.length === 0) {
			goto(`/match/${matchId}/media/${mediaType}/render`);
		} else {
			activeImageIndex = 0;
		}
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: matchTile, href: `/match/${matchId}` },
		{ name: 'Media', href: `/match/${matchId}/media` },
		{ name: mediaLabel, href: `/match/${matchId}/media/${mediaType}` },
	];

	const LINKS = [
		{ label: 'Upload', href: `/match/${matchId}/media/${mediaType}/upload/main`, icon: DrawIcon },
		{
			label: 'Adjust',
			href: `/match/${matchId}/media/${mediaType}/upload/main/adjust`,
			icon: DrawIcon,
		},
		{ label: 'Render', href: `/match/${matchId}/media/${mediaType}/render`, icon: DrawIcon },
		{ label: 'Caption', href: `/match/${matchId}/media/${mediaType}/caption`, icon: DrawIcon },
	];

	function getImages(type: string) {
		return images.filter((image) => image.type === type);
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Media: {mediaLabel}</HeadingLg>
<HeadingMd>Images</HeadingMd>

<div class="-mb-2 grid grid-cols-4 border border-slate-900">
	{#each images as image, i}
		<button class="inline-block overflow-hidden" onclick={() => (activeImageIndex = i)}>
			<img
				src={image.base64}
				alt={image.type}
				class="transform transition-transform duration-300 hover:scale-105 hover:opacity-75"
			/>
		</button>
	{/each}
</div>
<div class="grid grid-cols-4 border-x border-b border-slate-900">
	{#each images as image, i}
		{#if activeImageIndex === i}
			<div class="h-1 bg-slate-400"></div>
		{:else}
			<div class="bg-transparent"></div>
		{/if}
	{/each}
</div>

{#if activeImageIndex !== undefined}
	<div class="border border-slate-900">
		<img src={images[activeImageIndex].base64} alt={images[activeImageIndex].type} />
	</div>
{/if}

<HeadingMd>Manage</HeadingMd>
<ul role="list" class="grid grid-cols-4 gap-2">
	{#each LINKS as link}
		<LinkCard {link} />
	{/each}
</ul>
