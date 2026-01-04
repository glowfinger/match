<script lang="ts">
	import { onMount } from 'svelte';
	import { getEvent } from '$lib/database/event/EventDBService';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import EventImageWorker from '$lib/workers/EventImage.worker.ts?worker';
	import type { Event, EventImage } from '$lib/types/Event';
	import { getImagesByEvent } from '$lib/database/event/EventImageDBService';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { LayoutProps } from '../../$types';

	let props: LayoutProps = $props();
	let uuid = props.params.id as string;

	let worker: Worker = new EventImageWorker();
	let event: Event | undefined = $state();
	let images: EventImage[] = $state([]);
	let error: Error | undefined = $state();
	let view = $state('LANDSCAPE');

	worker.onmessage = async (event: MessageEvent) => {
		images = await getImagesByEvent(uuid);
	};

	onMount(async () => {
		[error, event] = await getEvent(uuid);
		images = await getImagesByEvent(uuid);

		handleGenerateImage();
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Events', href: '/events' },
		{ name: 'Event', href: `/events/${uuid}` },
	];
	function handleGenerateImage() {
		worker.postMessage(event?.uuid);
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Event</HeadingLg>

{#if error}
	<p>{error.message}</p>
{/if}
{#if event}
	<a href={`/events/${uuid}/details`}>Details</a>
	<a href={`/events/${uuid}/post`}>Post</a>
	<Button onclick={handleGenerateImage}>Generate Image</Button>
	<div class="flex justify-start gap-2">
		<button
			onclick={() => (view = 'LANDSCAPE')}
			class="border border-slate-600 bg-slate-800 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
			>Landscape</button
		>
		<button
			onclick={() => (view = 'PORTRAIT')}
			class="§ border border-slate-600 bg-slate-800 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-slate-500 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
			>Portrait</button
		>
		<button
			onclick={() => (view = 'SQUARE')}
			class="border border-slate-600 bg-slate-800 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-slate-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-slate-600"
			>Square</button
		>
		<button
			onclick={() => (view = 'STORY')}
			class="border border-slate-600 bg-slate-800 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
			>Story</button
		>
	</div>
{/if}

<div class="mt-2 overflow-x-scroll">
	<pre>{JSON.stringify(event, null, 2)}</pre>
</div>

{#if images.length > 0}
	<div class="grid grid-cols-1">
		{#each images as image}
			<img src={image.base64} alt={image.type} />
		{/each}
	</div>
{/if}
