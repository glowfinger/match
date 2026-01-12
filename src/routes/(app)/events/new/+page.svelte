<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { addEvent } from '$lib/database/event/EventDBService';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import EventImageWorker from '$lib/workers/EventImage.worker.ts?worker';

	let worker: Worker = new EventImageWorker();
	worker.onmessage = async (event: MessageEvent) => {
		console.log(event);
	};

	onMount(async () => {
		const [error, uuid] = await addEvent(navigator.userAgent);
		if (error) {
			console.error(error);
		}
		await goto(`/events/${uuid}`);
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Events', href: '/events' },
		{ name: 'New Event', href: '/events/new' },
	];
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>New Event</HeadingLg>
