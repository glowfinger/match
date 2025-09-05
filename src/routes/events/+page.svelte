<script lang="ts">
	import { onMount } from 'svelte';
	import { getEvents } from '$lib/database/event/EventDBService';
	import type { Event } from '$lib/types/Event';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';

	let events: Event[] = $state([]);

	onMount(async () => {
		const [error, eventsData] = await getEvents();
		if (error) {
			console.error(error);
		}

		console.log(eventsData);
		events = eventsData ?? [];
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Events', href: '/events' },
	];
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Events</HeadingLg>
<a
	href={`/events/new`}
	class="border border-transparent bg-slate-800 px-4 py-2 text-center text-sm text-white shadow-md transition-all hover:bg-slate-700 hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
	>Add New event</a
>

{#each events as event}
	<a href={`/events/${event.uuid}`} class="focus:outline-hidden">
		<p>{event.createdAt} {event.userAgent} {event.uuid}</p>
	</a>
{/each}
