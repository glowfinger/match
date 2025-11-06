<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { KIT_VALUES } from '$lib/canvas/constants/Colours';
	import { getImageBitmap } from '$lib/canvas/ImageCache';
	import { blobToData } from '$lib/canvas/renderers/CanvasSplitter';
	import matchRenderer, { type CanvasImage } from '$lib/canvas/renderers/MatchRenderer';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import CancelLink from '$lib/components/forms/CancelLink.svelte';
	import SubmitButton from '$lib/components/forms/SubmitButton.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { Button } from '$lib/components/ui/button';
	import { MEDIA_IMAGES, MediaImageTypes, SPONSORS, UPLOAD_TYPES } from '$lib/Constants';
	import { getFonts } from '$lib/database/FontDBService';
	import type { ImageUpload, Match } from '$lib/database/IndexedDB';
	import {
		getUploadByMatchAndTypes,
		getUploadsByMatchAndMedia,
		hasUploadByMatchAndTypes,
		updateUploadSettingsById,
	} from '$lib/database/match/ImageUploadDBService';
	import { setMatchImage } from '$lib/database/match/MatchImageDBService';
	import { getMatch } from '$lib/database/MatchService';
	import { onDestroy, onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { set } from 'zod';

	const matchId = Number.parseInt(page.params.id as string);
	const mediaType = page.params.mediaType as string;
	const mediaLabel = MediaImageTypes.find(({ type }) => type === mediaType)?.label;
	if (!mediaLabel) {
		throw new Error('Media type is required');
	}
	const uploadType = page.params.uploadType as string;
	const uploadLabel = UPLOAD_TYPES.find(({ type }) => type === uploadType)?.label;
	if (!uploadLabel) {
		throw new Error('Upload type is required');
	}

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: 'Media', href: `/match/${matchId}/media` },
		{ name: mediaLabel, href: `/match/${matchId}/media/${mediaType}` },
		{ name: uploadLabel, href: `/match/${matchId}/media/${mediaType}/upload/${uploadType}` },
		{ name: 'Adjust', href: `/match/${matchId}/media/${mediaType}/upload/${uploadType}/adjust` },
	];

	let canvas: HTMLCanvasElement | undefined = $state();
	let match: Match | undefined = $state();
	let images: CanvasImage[] = $state([]);

	let settings = $state({
		zoom: 1,
		x: 0,
		y: 0,
	});

	onMount(async () => {
		match = await getMatch(matchId);

		if (!match) {
			throw new Error('Match not found');
		}

		if (!canvas) {
			return;
		}

		const upload = await getUploadByMatchAndTypes(matchId, mediaType, uploadType);
		if (!upload) {
			goto(`/match/${matchId}/media/${mediaType}/upload/${uploadType}`);
			throw new Error('Upload not found');
		}

		settings = { ...upload.settings };

		const uploads = await getUploadsByMatchAndMedia(matchId, mediaType);

		images = await Promise.all(
			uploads.map(async (upload: ImageUpload) => ({
				photo: await createImageBitmap(upload.blob),
				uploadType: upload.uploadType,
				mediaType: upload.mediaType,
				settings: upload.settings,
			})),
		);

		const backgroundImages = await Promise.all(
			MEDIA_IMAGES.filter((image) => image.mediaTypes.includes(mediaType))
				.filter((image) => kitFilter(image.kit, match?.detail?.kit ?? KIT_VALUES.MAIN))

				.map(async (image) => {
					return {
						photo: await getImageBitmap(image.url),
						uploadType: image.version,
						mediaType: mediaType,
						settings: {
							zoom: 1,
							x: 0,
							y: 0,
						},
					};
				}),
		);

		// preload sponsor images
		// preload team images

		images = [...images, ...backgroundImages];

		const fonts = await getFonts();

		for await (const font of fonts) {
			await new FontFace(font.type, font.blob).load().then((font) => {
				document.fonts.add(font);
			});
		}

		matchRenderer(canvas as HTMLCanvasElement, match, images);
	});

	onDestroy(() => {
		canvas = undefined;
	});

	$effect(() => {
		if (!canvas || !match || !images) {
			return;
		}

		const index = images.findIndex((image: CanvasImage) => image.uploadType === uploadType);

		if (index !== -1) {
			// compare settings and if they are different, update the image
			if (
				images[index].settings.zoom !== settings.zoom ||
				images[index].settings.x !== settings.x ||
				images[index].settings.y !== settings.y
			) {
				images[index].settings = { ...settings };

				matchRenderer(canvas as HTMLCanvasElement, match, images);
			}
		}
	});

	async function updateUploadSettings(e: SubmitEvent) {
		e.preventDefault();

		const upload = await getUploadByMatchAndTypes(matchId, mediaType, uploadType);
		if (!upload) {
			throw new Error('Upload not found');
		}

		await updateUploadSettingsById(upload.id, settings);

		if (!canvas) {
			return;
		}

		canvas.toBlob(async (blob) => {
			if (!blob) {
				return;
			}
			const base64 = await blobToData(blob);
			await setMatchImage({
				matchId,
				type: mediaType,
				page: 1,
				base64: base64 as string,
				createdAt: new Date().toISOString(),
			});
		});

		toast.success('Settings updated');
		goto(`/match/${matchId}/media/${mediaType}`);
	}

	function resetSettings() {
		settings = {
			zoom: 1,
			x: 0,
			y: 0,
		};
	}

	function kitFilter(kit: string | undefined, matchKit: string | undefined) {
		return kit === matchKit;
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>{uploadLabel}</HeadingLg>
<HeadingMd>Adjust image</HeadingMd>

<canvas bind:this={canvas} width={1080} height={1350} class="w-full border border-slate-900"
></canvas>
<form onsubmit={updateUploadSettings} novalidate>
	<div class="mt-6">
		<!-- <InputLabel id="zoom" title="Zoom" /> -->
		<input
			id="zoom"
			type="range"
			bind:value={settings.zoom}
			step=".25"
			min="1"
			max="20"
			class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700"
		/>
	</div>

	<div class="mt-6">
		<!-- <InputLabel id="horizontal" title="Horizontal" /> -->
		<input
			id="horizontal"
			type="range"
			bind:value={settings.x}
			step="0.01"
			min="-1"
			max="1"
			class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700"
		/>
	</div>

	<div class="mt-6">
		<!-- <InputLabel id="vertical" title="Vertical" /> -->
		<input
			id="vertical"
			type="range"
			bind:value={settings.y}
			step="0.01"
			min="-1"
			max="1"
			class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700"
		/>
	</div>
	<div class="mt-4 grid grid-cols-1 gap-2">
		<Button type="button" onclick={resetSettings}>Reset photo</Button>
		<SubmitButton>Save photo</SubmitButton>
		<CancelLink href={`/match/${matchId}/media/${mediaType}`}
			>Back to {mediaLabel.toLowerCase()} image</CancelLink
		>
	</div>
</form>
