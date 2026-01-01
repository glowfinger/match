<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { hasUploadByMatchIdAndMediaType } from '$lib/database/match/ImageUploadDBService';
	import { onMount } from 'svelte';
	import LineupRenderer from '$lib/canvas/renderers/LineupRenderer';
	import resultRender from '$lib/canvas/renderers/ResultRenderer';
	import matchRenderer from '$lib/canvas/renderers/MatchRenderer';
	import { getMatch } from '$lib/database/MatchService';
	import type { Match, MatchImage } from '$lib/database/IndexedDB';
	import canvasSplitter from '$lib/canvas/renderers/CanvasSplitter';
	import { setMatchImage } from '$lib/database/match/MatchImageDBService';
	import canvasImageLoader from '$lib/canvas/images/CanvasImageLoader';
	import type { CanvasImage } from '$lib/types/Images';
	import type { LayoutProps } from '../../../$types';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import DrawIcon from '$lib/components/icons/DrawIcon.svelte';
	import LinkCard from '$lib/components/cards/LinkCard.svelte';

	const mediaType = page.params.mediaType as string;

	let canvas: HTMLCanvasElement | undefined = $state();

	let { data }: LayoutProps = $props();
	const { matchId, match, matchTile } = data;

	let canvasImages: CanvasImage[] = $state([]);
	let WIDTH = $state(1080);
	let HEIGHT = $state(1350);

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: matchTile, href: `/match/${matchId}` },
	];

	onMount(async () => {
		canvasImages = await canvasImageLoader(match, mediaType);
	});

	$effect(() => {
		if (!match) {
			return;
		}

		if (!canvas) {
			return;
		}

		let images: Omit<MatchImage, 'id'>[] = [];

		if (mediaType === 'MATCH') {
			WIDTH = 1080;
			HEIGHT = 1350;
			matchRenderer(canvas, match, canvasImages).then(saveImages).then(backToMedia);
		}

		if (mediaType === 'LINEUP') {
			WIDTH = 1080 * 4;
			HEIGHT = 1350;
			LineupRenderer(canvas, matchId, canvasImages).then(saveImages).then(backToMedia);
		}

		if (mediaType === 'RESULT') {
			WIDTH = 1080;
			HEIGHT = 1350;
			resultRender(canvas, matchId, canvasImages).then(saveImages).then(backToMedia);
		}
	});

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

	function backToMedia() {
		// goto(`/match/${matchId}/media/${mediaType}`);
	}
	function saveImages(images: Omit<MatchImage, 'id'>[]) {
		return images.map(async (image) => await setMatchImage(image));
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Render</HeadingLg>

<div class="aspect-[4/5] h-full overflow-x-scroll">
	<canvas bind:this={canvas} width={WIDTH} height={HEIGHT} class="w-full border border-slate-900"
	></canvas>
</div>

<HeadingMd>Manage</HeadingMd>
<ul role="list" class="grid grid-cols-4 gap-2">
	{#each LINKS as link}
		<LinkCard {link} />
	{/each}
</ul>
