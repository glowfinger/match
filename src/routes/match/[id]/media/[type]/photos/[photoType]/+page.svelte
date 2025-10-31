<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getMatch, updateMatchTeam } from '$lib/database/MatchService';

	import type { Match, MatchImageUploads, MatchTeam } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { getErrors, isValid } from '$lib/validation/Validator';
	import { matchTeamSchema } from '$lib/validation/Schemas';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import SubmitButton from '$lib/components/forms/SubmitButton.svelte';
	import CancelLink from '$lib/components/forms/CancelLink.svelte';
	import Dropzone from '$lib/components/forms/Dropzone.svelte';
	import {
		createUpload,
		deleteUploadByMatch,
		getUploadByMatchAndTypes,
	} from '$lib/database/match/MatchImageUploadDBService';
	const matchId = Number.parseInt(page.params.id as string);
	const matchImageType = page.params.type as string;
	const uploadedImageType = page.params.photoType as string;
	let match: Match | undefined = $state();
	let upload: MatchImageUploads | undefined = $state();
	let file: File | undefined = $state();

	function uploadFiles() {
		console.log(file);
	}

	async function deleteUpload() {
		if (upload) {
			await deleteUploadByMatch(upload.matchId, upload.matchImageType, upload.uploadedImageType);
			upload = undefined;
			file = undefined;
		}
	}

	// TODO: This should be from constants or ENV
	let data = $state<MatchTeam>({
		key: 'chipstead',
		club: 'Chipstead',
		squad: '',
		badge: 'https://glowfinger.blob.core.windows.net/chipstead/teams/chipstead.png',
	});
	let errors = $state({ club: '', squad: '' });

	onMount(async () => {
		match = await getMatch(matchId);
		upload = await getUploadByMatchAndTypes(matchId, matchImageType, uploadedImageType);

		if (upload) {
			file = new File([upload.blob as Blob], upload.meta.filename, {
				type: upload.meta.mimetype as string,
			});
		}
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: `Image`, href: `/match/${matchId}/media/${matchImageType}` },
		{
			name: uploadedImageType,
			href: `/match/${matchId}/media/${matchImageType}/photos/${uploadedImageType}`,
		},
	];

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (file) {
			upload = await createUpload({
				matchId,
				matchImageType,
				uploadedImageType,
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
					page: 1,
				},
			});
		}

		toast.success('Photo uploaded');
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>{uploadedImageType}</HeadingLg>
<form onsubmit={handleSubmit} novalidate>
	<div class="mt-4 grid grid-cols-1 gap-2">
		{#if !match}
			<p>Match not found</p>
		{:else}
			<Dropzone bind:file />
			<Separator />

			<Button type="button" onclick={deleteUpload}>Delete photo</Button>

			{#if file}
				<SubmitButton>Save photo</SubmitButton>
			{:else}
				<SubmitButton disabled>Save photo</SubmitButton>
			{/if}
		{/if}
	</div>
</form>
<CancelLink href={`/match/${matchId}/media/${matchImageType}`}>Cancel</CancelLink>

<pre class="overflow-x-scroll">{JSON.stringify(upload, null, 2)}</pre>
<pre class="overflow-x-scroll">{JSON.stringify(file, null, 2)}</pre>
