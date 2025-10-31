<script lang="ts">
	import { page } from '$app/state';
	import matchRenderer from '$lib/canvas/renderers/MatchRenderer';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { MediaImageTypes, UploadImageTypes, type MediaImageType } from '$lib/Constants';
	import { type Match, type MatchImage, type MatchImageUploads } from '$lib/database/IndexedDB';
	import { getImagesByMatchAndType } from '$lib/database/match/MatchImageDBService';
	import {
		getUploadByMatchAndTypes,
		updateUploadSettingsById,
	} from '$lib/database/match/MatchImageUploadDBService';
	import { getMatch } from '$lib/database/MatchService';
	import ImageWorker from '$lib/workers/Image.worker.ts?worker';
	import { onDestroy, onMount } from 'svelte';

	const matchId = Number.parseInt(page.params.id as string);

	let canvas: HTMLCanvasElement | undefined = $state();
	let context: CanvasRenderingContext2D | undefined = $state();

	const matchImageType = page.params.type as string;
	const mediaType = MediaImageTypes.find((m) => m.type === matchImageType);
	let match: Match | undefined = $state();
	let images: MatchImage[] = $state([]);
	let generating: string[] = $state([]);
	let viewing = $state(0);

	let upload: MatchImageUploads | undefined = $state();

	// let worker: Worker = new ImageWorker();
	// worker.onmessage = async (event: MessageEvent) => {
	// const { type, task } = event.data;
	// if (task === 'IMAGES_GENERATED' && type === matchImageType) {
	// 	generating = generating.filter((t) => t !== type);
	// 	images = await getImagesByMatchAndType(matchId, matchImageType);
	// }
	// if (task === 'NO_IMAGES_GENERATED' && type === matchImageType) {
	// 	generating = generating.filter((t) => t !== type);
	// 	images = await getImagesByMatchAndType(matchId, matchImageType);
	// }
	// };

	onMount(async () => {
		[match, upload] = await Promise.all([
			getMatch(matchId),
			getUploadByMatchAndTypes(matchId, matchImageType, UploadImageTypes.MAIN),
		]);

		// if (upload) {
		// 	imageConfig = {
		// 		zoom: upload.settings.zoom,
		// 		horizontal: upload.settings.x,
		// 		vertical: upload.settings.y,
		// 	};
		// }
		// if (images.length === 0) {
		// generateImage(matchImageType);

		// if (canvas) {
		// 	await matchRenderer(canvas, matchId, matchImageType);
		// }
		// }
	});

	$effect(() => {
		if (!canvas) {
			return;
		}
		matchRenderer(canvas, matchId, matchImageType);
	});

	$effect(() => {
		if (!upload) {
			return;
		}

		const settings = { ...upload.settings };

		updateUploadSettingsById(upload.id, settings).then(() => {
			matchRenderer(canvas as HTMLCanvasElement, matchId, matchImageType);
		});
	});

	onDestroy(() => {
		// worker.terminate();
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: 'Media', href: `/match/${matchId}/media` },
		{ name: mediaType?.label, href: `/match/${matchId}/media/${mediaType?.label}` },
	];

	function generateImage(type: string) {
		// worker.postMessage({ matchId, type });
		generating = [...generating, type];
	}

	async function handleHighlightSubmit(e: SubmitEvent) {
		e.preventDefault();
	}

	async function resetImage() {
		if (!upload) {
			return;
		}
		await updateUploadSettingsById(upload.id, { ...upload.settings, zoom: 1, x: 0, y: 0, page: 1 });
		upload = await getUploadByMatchAndTypes(matchId, matchImageType, UploadImageTypes.MAIN);
		if (canvas) {
			matchRenderer(canvas, matchId, matchImageType);
		}
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Add media</HeadingLg>
<HeadingMd>Post</HeadingMd>
<canvas bind:this={canvas} width="1080" height="1350" class="w-full border border-slate-900"
></canvas>

<!-- {#if matchImageType === 'highlight'}
	<form onsubmit={handleHighlightSubmit}>
		<label for="title">Title</label>
		<input type="text" id="title" name="title" />
		<label for="description">Description</label>
		<textarea id="description" name="description"></textarea>
		<button
			type="submit"
			class="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
		>
			Submit
		</button>
	</form>
{/if} -->

<button
	onclick={resetImage}
	class="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
>
	Reset
</button>

{#if upload}
	<div class="mt-6">
		<!-- <InputLabel id="zoom" title="Zoom" /> -->
		<input
			id="zoom"
			type="range"
			bind:value={upload.settings.zoom}
			step=".25"
			min="1"
			max="20"
			class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700"
		/>
	</div>

	<div class="mt-6">
		<!-- <InputLabel id="horizontal" title="Horizontal" /> -->
		<input
			id="horizontal"
			type="range"
			bind:value={upload.settings.x}
			step="0.1"
			min="-1"
			max="1"
			class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700"
		/>
	</div>

	<div class="mt-6">
		<!-- <InputLabel id="vertical" title="Vertical" /> -->
		<input
			id="vertical"
			type="range"
			bind:value={upload.settings.y}
			step="0.1"
			min="-1"
			max="1"
			class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700"
		/>
	</div>
{/if}

<a href={`/match/${matchId}/media/${matchImageType}/photos/main`}>Photos</a>

<pre class=" overflow-x-scroll">{JSON.stringify(upload, null, 2)}</pre>
