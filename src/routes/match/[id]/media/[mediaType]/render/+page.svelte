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

	const mediaType = page.params.mediaType as string;

	let canvas: HTMLCanvasElement | undefined = $state();

	let { data }: LayoutProps = $props();
	const { matchId, match, matchTile } = data;

	let canvasImages: CanvasImage[] = $state([]);
	let WIDTH = $state(1080);
	let HEIGHT = $state(1350);

	onMount(async () => {
		const hasUpload = await hasUploadByMatchIdAndMediaType(matchId, mediaType);

		canvasImages = await canvasImageLoader(match, mediaType);
		if (!match) {
			throw new Error('Match not found');
		}

		// if (hasUpload) {
		// 	goto(`/match/${matchId}/media/${mediaType}`);
		// }
	});

	$effect(() => {
		if (!match) {
			return;
		}

		if (!canvas) {
			return;
		}

		if (mediaType === 'MATCH') {
			WIDTH = 1080;
			HEIGHT = 1350;
			// TODO load background images
			// TODO load sponsor images
			// TODO load team badges
			// TODO load uploaded
			matchRenderer(canvas, match);
		}

		if (mediaType === 'LINEUP') {
			WIDTH = 1080 * 4;
			HEIGHT = 1350;
			LineupRenderer(canvas, matchId, canvasImages).then((images) =>
				images.map((image) => setMatchImage(image)),
			);
			// .then(() => goto(`/match/${matchId}/media/${mediaType}`));
		}

		if (mediaType === 'RESULT') {
			WIDTH = 1080;
			HEIGHT = 1350;
			const images = resultRender(canvas, matchId, canvasImages);
		}
	});
</script>

<div class="aspect-[4/5] h-full overflow-x-scroll">
	<canvas bind:this={canvas} width={WIDTH} height={HEIGHT} class="w-full border border-slate-900"
	></canvas>
</div>
