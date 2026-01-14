<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	import type { Match, ImageUpload } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { toast } from 'svelte-sonner';
	import SubmitButton from '$lib/components/forms/SubmitButton.svelte';
	import CancelLink from '$lib/components/forms/CancelLink.svelte';
	import Dropzone from '$lib/components/forms/Dropzone.svelte';
	import {
		deleteUploadByMatchAndTypes,
		getUploadByMatchAndTypes,
		putUpload,
	} from '$lib/database/match/ImageUploadDBService';
	import { MediaImageTypes, UPLOAD_TYPES, UploadImageTypes } from '$lib/Constants';
	import { goto } from '$app/navigation';
	import type { LayoutProps } from '../../../../$types';

	let props: LayoutProps = $props();
	let matchId = props.data.matchId;
	let match = props.data.match;

	const mediaType = props.params.mediaType as string;
	const mediaLabel = MediaImageTypes.find((m) => m.type === mediaType)?.label;
	if (!mediaLabel) {
		throw new Error('Media type is required');
	}
	const uploadType = props.params.uploadType as string;
	const uploadLabel = UPLOAD_TYPES.find((m) => m.type === uploadType)?.label;
	if (!uploadLabel) {
		throw new Error('Upload type is required');
	}

	let upload: ImageUpload | undefined = $state();
	let file: File | undefined = $state();

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: `Image`, href: `/match/${matchId}/media/${mediaType}` },
		{
			name: uploadLabel,
			href: `/match/${matchId}/media/${mediaType}/upload/${uploadType}`,
		},
	];

	onMount(async () => {
		upload = await getUploadByMatchAndTypes(matchId, mediaType, uploadType);

		if (upload) {
			file = new File([upload.blob as Blob], upload.meta.filename, {
				type: upload.meta.mimetype as string,
			});
		}
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!file || !match) {
			return;
		}

		await putUpload({
			matchId,
			mediaType,
			uploadType: UploadImageTypes.MAIN,
			createdAt: new Date().toISOString(),
			blob: file,
			meta: {
				filename: file.name,
				filesize: file.size,
				mimetype: file.type,
			},
			settings: {
				x: 0,
				y: 0,
				zoom: 1,
			},
		});

		toast.success('Photo uploaded');
		goto(`/match/${matchId}/media/${mediaType}/upload/${uploadType}/adjust`);
	}

	async function deleteUpload() {
		if (upload) {
			await deleteUploadByMatchAndTypes(upload.matchId, upload.mediaType, upload.uploadType);
			upload = undefined;
			file = undefined;
		}
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>{uploadLabel}</HeadingLg>

<form onsubmit={handleSubmit} novalidate>
	<div class="mt-4 grid grid-cols-1 gap-2">
		{#if !match}
			<p>Match not found</p>
		{:else}
			<Dropzone bind:file />

			<Separator />
			<Button type="button" onclick={deleteUpload}>Delete photo</Button>
			<SubmitButton disabled={!file}>Save photo</SubmitButton>
		{/if}

		<CancelLink href={`/match/${matchId}/media/${mediaType}`}>Back to images</CancelLink>
	</div>
</form>
