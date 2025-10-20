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
	let viewing = $state(0);

	let worker: Worker = new ImageWorker();
	worker.onmessage = async (event: MessageEvent) => {
		const { type, task } = event.data;

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
		[match, images] = await Promise.all([
			getMatch(matchId),
			getImagesByMatchAndType(matchId, matchImageType),
		]);

		// if (images.length === 0) {
		generateImage(matchImageType);

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

{#if images.length > 0 && viewing >= 0 && generating.includes(matchImageType) === false}
	<div class="border border-slate-900">
		<img class="block w-full shrink-0" src={images[viewing].base64} alt={images[viewing].type} />
	</div>
{:else}
	<div
		class="relative block aspect-4/5 w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-white/15"
	>
		<svg
			viewBox="0 0 48 48"
			fill="none"
			stroke="currentColor"
			aria-hidden="true"
			class="mx-auto size-12 text-gray-400 dark:text-gray-500"
		>
			<path
				d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		<span class="mt-2 block text-sm font-semibold text-gray-900 dark:text-white">Rendering...</span>
	</div>
{/if}

{#if images.length > 1 && generating.includes(matchImageType) === false}
	<div class="grid grid-cols-4 gap-0 border border-slate-900">
		{#if generating.includes(matchImageType) === false}
			{#each images as image, index}
				<button onclick={() => (viewing = index)}>
					<img class="block w-full shrink-0" src={image.base64} alt={image.type} />
				</button>
			{/each}
		{/if}
	</div>
{/if}

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

<pre class="overflow-x-scroll">{JSON.stringify(
		images.map((image) => ({ ...image, base64: image.base64.length })),
		null,
		2,
	)}</pre>
