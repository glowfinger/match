<script lang="ts">
	import { onMount } from 'svelte';
	import type { Event, EventPost } from '$lib/types/Event';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import { getEvent, updateEvenPost } from '$lib/database/event/EventDBService';
	import type { LayoutProps } from '../../../$types';
	let props: LayoutProps = $props();
	let uuid = props.params.id as string;

	let event: Event | undefined = $state();
	let error: Error | undefined = $state();

	let data = $state<EventPost>({
		body: '',
		tags: '',
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Events', href: '/events' },
		{ name: 'Event', href: `/events/${uuid}` },
		{ name: 'Post', href: `/events/${uuid}/post` },
	];

	onMount(async () => {
		[error, event] = await getEvent(uuid);
		if (event?.post) {
			data = { ...event.post };
		}
	});

	$effect(() => {
		updateEvenPost(uuid, { ...data });
	});
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Post</HeadingLg>

<div class="mt-2 grid grid-cols-1 gap-4">
	<div class="grid w-full items-center gap-1.5">
		<Label for="body">Body</Label>
		<Textarea id="body" bind:value={data.body} />
	</div>
	<div class="grid w-full items-center gap-1.5">
		<Label for="tags">Tags</Label>
		<Input type="text" id="tags" bind:value={data.tags} />
	</div>
	<Separator />
	<Button href={`/events/${uuid}`} variant="outline">Back</Button>
</div>
