<script lang="ts">
	import { page } from '$app/state';
	import { getImagesByEvent } from '$lib/database/event/EventImageDBService';
	import { onMount } from 'svelte';
	import type { Event, EventDetails, EventImage } from '$lib/types/Event';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { getEvent, updateEvenDetails } from '$lib/database/event/EventDBService';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import EventImageWorker from '$lib/workers/EventImage.worker.ts?worker';
	const uuid = page.params.id as string;

	let worker: Worker = new EventImageWorker();
	worker.onmessage = async (event: MessageEvent) => {
		images = await getImagesByEvent(uuid);
	};
	let event: Event | undefined = $state();
	let error: Error | undefined = $state();
	let images: EventImage[] = $state([]);
	let status = $state('IDLE');

	let data = $state<EventDetails>({
		headline: '',
		body: '',
		cta: '',
		footnote: '',
		highlights: '',
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Events', href: '/events' },
		{ name: 'Event', href: `/events/${uuid}` },
		{ name: 'Details', href: `/events/${uuid}/details` },
	];

	onMount(async () => {
		status = 'LOADING';
		[error, event] = await getEvent(uuid);
		if (event?.details) {
			data.headline = event.details.headline;
			data.body = event.details.body;
			data.cta = event.details.cta;
			data.footnote = event.details.footnote;
			data.highlights = event.details.highlights;
		}
		images = await getImagesByEvent(uuid);
		status = 'LOADED';
	});

	$effect(() => {
		if (status === 'LOADED') {
			updateEvenDetails(uuid, { ...data }).then(() => {
				worker.postMessage(uuid);
			});
		}
	});
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Details</HeadingLg>
{#if status === 'LOADING'}
	<p>Loading...</p>
{:else if status === 'LOADED'}
	{#if images.length > 0}
		<div class="grid grid-cols-1">
			{#each images as image}
				<img src={image.base64} alt={image.type} />
			{/each}
		</div>
	{/if}

	<div class="mt-2 grid grid-cols-1 gap-4">
		<div class="grid w-full items-center gap-1.5">
			<Label for="headline">Headline</Label>
			<Textarea id="headline" bind:value={data.headline} rows={10} />
		</div>
		<div class="grid w-full items-center gap-1.5">
			<Label for="cta">CTA</Label>
			<Textarea id="cta" bind:value={data.cta} />
		</div>
		<div class="grid w-full items-center gap-1.5">
			<Label for="body">Body</Label>
			<Textarea id="body" bind:value={data.body} />
		</div>
		<div class="grid w-full items-center gap-1.5">
			<Label for="highlights">Highlights</Label>
			<Textarea id="highlights" bind:value={data.highlights} />
		</div>
		<div class="grid w-full items-center gap-1.5">
			<Label for="footnote">Footnote</Label>
			<Textarea id="footnote" bind:value={data.footnote} />
		</div>
		<Separator />
		<Button href={`/events/${uuid}`} variant="outline">Back</Button>
	</div>
{/if}

<pre>{JSON.stringify([event, data, images], null, 2)}</pre>
