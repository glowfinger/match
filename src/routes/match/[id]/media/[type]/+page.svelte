<script lang="ts">
	import { page } from '$app/state';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { MediaImageTypes, type MediaImageType } from '$lib/Constants';
	import { type Match, type MatchImage } from '$lib/database/IndexedDB';
	import { getImagesByMatchAndType } from '$lib/database/match/MatchImageDBService';
	import { getMatch } from '$lib/database/MatchService';
	import ImageWorker from '$lib/workers/Image.worker.ts?worker';
	import { onDestroy, onMount } from 'svelte';

	const matchId = Number.parseInt(page.params.id as string);
	const matchImageType = page.params.type as string;
	const mediaType = MediaImageTypes.find((m) => m.type === matchImageType);
	let match: Match | undefined = $state();
	let images: MatchImage[] = $state([]);
	let generating: string[] = $state([]);

	let worker: Worker = new ImageWorker();
	worker.onmessage = async (event: MessageEvent) => {
		const { type, task } = event.data;

		console.log('worker.onmessage', event.data);

		if (task === 'IMAGES_GENERATED' && type === matchImageType) {
			generating = generating.filter((t) => t !== type);
			images = await getImagesByMatchAndType(matchId, matchImageType);
		}

		if (task === 'NO_IMAGES_GENERATED' && type === matchImageType) {
			generating = generating.filter((t) => t !== type);
			images = await getImagesByMatchAndType(matchId, matchImageType);
		}
	};

	onMount(async () => {
		const promise = Promise.all([
			getMatch(matchId),
			getImagesByMatchAndType(matchId, matchImageType),
		]);
		generateImage(matchImageType);
		const [matchData, imagesData] = await promise;
		match = matchData;
		images = imagesData;

		// if (images.length === 0) {
		// 	worker.postMessage({ matchId, type: matchImageType });
		// }
	});

	onDestroy(() => {
		worker.terminate();
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: 'Media', href: `/match/${matchId}/media` },
		{ name: mediaType?.label, href: `/match/${matchId}/media/${mediaType?.label}` },
	];

	function generateImage(type: string) {
		worker.postMessage({ matchId, type });
		generating = [...generating, type];
	}

	async function handleHighlightSubmit(e: SubmitEvent) {
		e.preventDefault();
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Add media</HeadingLg>

<button
	type="button"
	onclick={() => generateImage(matchImageType)}
	class="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
	>Redraw image</button
>
<HeadingMd>Post</HeadingMd>

{#if images.length > 0}
	<img src={images[3].base64} alt={images[3].type} />
{/if}

{#if images.length === 2}
	<div>
		<div class="grid grid-cols-3">
			{#each images as image}
				<img src={image.base64} alt={image.type} />
			{/each}
		</div>
	</div>
{:else if images.length === 4}
	<div class="gap-y- grid grid-cols-4">
		{#each images as image}
			<img src={image.base64} alt={image.type} />
		{/each}
	</div>
{:else if images.length === 1}
	<div class="grid grid-cols-1">
		{#each images as image}
			<img src={image.base64} alt={image.type} />
		{/each}
	</div>
{:else if images.length === 0}
	<p>No images</p>
{:else}{/if}

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

<pre class=" overflow-x-scroll">{JSON.stringify(match, null, 2)}</pre>
