<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { page } from '$app/state';
	import type { LayoutProps } from '../../../$types';
	import { MediaImageTypes } from '$lib/Constants';
	import { Textarea } from '$lib/components/ui/textarea';
	import CancelLink from '$lib/components/forms/CancelLink.svelte';

	import { toast } from 'svelte-sonner';
	import SubmitButton from '$lib/components/forms/SubmitButton.svelte';
	import { getCaption } from '$lib/utils/CaptionWriter';
	import { onMount } from 'svelte';

	const { data }: LayoutProps = $props();
	const { matchId, match, matchTile } = data;
	const mediaType = page.params.mediaType;
	if (!match) {
		throw new Error('Match not found');
	}
	const mediaLabel = MediaImageTypes.find((m) => m.type === mediaType)?.label;
	if (!mediaLabel) {
		throw new Error('Media type is required');
	}

	let caption = $state('');

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: matchTile, href: `/match/${matchId}` },
		{ name: 'Media', href: `/match/${matchId}/media` },
		{ name: mediaLabel, href: `/match/${matchId}/media/${mediaType}` },
		{ name: 'Caption', href: `/match/${matchId}/media/${mediaType}/caption` },
	];

	function copyToClipboard(e: SubmitEvent) {
		e.preventDefault();
		if (!caption) {
			return;
		}

		navigator.clipboard.writeText(caption);
		toast.success('Caption copied to clipboard');
	}

	onMount(async () => {
		caption = await getCaption(mediaType as string, match);
	});
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Caption</HeadingLg>
<HeadingMd>Media: {mediaLabel}</HeadingMd>

<form onsubmit={copyToClipboard} novalidate class="grid grid-cols-1 gap-2">
	<Textarea value={caption} rows={10} disabled={true} class="bg-slate-50" />
	<SubmitButton>Copy caption</SubmitButton>
	<CancelLink href={`/match/${matchId}/media/${mediaType}`}
		>Back to {mediaLabel.toLowerCase()} image</CancelLink
	>
</form>
