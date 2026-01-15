<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import canvasImageLoader from '$lib/canvas/images/CanvasImageLoader';
	import { blobToData } from '$lib/canvas/renderers/CanvasSplitter';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import CancelLink from '$lib/components/forms/CancelLink.svelte';
	import SubmitButton from '$lib/components/forms/SubmitButton.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { Button } from '$lib/components/ui/button';
	import { MediaImageTypes, UPLOAD_TYPES } from '$lib/Constants';
	import {
		getUploadByMatchAndTypes,
		updateUploadSettingsById,
	} from '$lib/database/match/ImageUploadDBService';
	import { setMatchImage } from '$lib/database/match/MatchImageDBService';
	import type { CanvasImage } from '$lib/types/Images';

	import { toast } from 'svelte-sonner';
	import type { LayoutProps } from '../../../../../$types';
	import matchCanvasRenderer from '$lib/canvas/renderers/MatchCanvasRenderer';

	let canvas: HTMLCanvasElement | undefined = $state();
	let canvasImages: CanvasImage[] = $state([]);
	let adjustIndex: number | undefined = $state();

	let props: LayoutProps = $props();
	let matchId = props.data.matchId;
	let matchTile = props.data.matchTile;
	let match = props.data.match;

	const mediaType = props.params.mediaType as string;
	const mediaLabel = MediaImageTypes.find(({ type }) => type === mediaType)?.label;
	if (!mediaLabel) {
		throw new Error('Media type is required');
	}
	const uploadType = props.params.uploadType as string;
	const uploadLabel = UPLOAD_TYPES.find(({ type }) => type === uploadType)?.label;
	if (!uploadLabel) {
		throw new Error('Upload type is required');
	}

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: matchTile, href: `/match/${matchId}` },
		{ name: 'Media', href: `/match/${matchId}/media` },
		{ name: mediaLabel, href: `/match/${matchId}/media/${mediaType}` },
		{ name: 'Adjust', href: `/match/${matchId}/media/${mediaType}/upload/${uploadType}/adjust` },
	];

	let settings = $state({
		zoom: 1,
		x: 0,
		y: 0,
	});

	onMount(async () => {
		if (!canvas) {
			return;
		}

		const upload = await getUploadByMatchAndTypes(matchId, mediaType, uploadType);
		if (!upload) {
			goto(`/match/${matchId}/media/${mediaType}/upload/${uploadType}`);
			throw new Error('Upload not found');
		}

		settings = { ...upload.settings };

		canvasImages = await canvasImageLoader(match, mediaType);
		adjustIndex = canvasImages.findIndex(
			(image: CanvasImage) =>
				image.uploadType.toUpperCase() === 'UPLOAD'.toUpperCase() &&
				image.mediaType.toUpperCase() === 'MAIN'.toUpperCase(),
		);

		matchCanvasRenderer(canvas as HTMLCanvasElement, match, mediaType, canvasImages);
	});

	onDestroy(() => {
		canvas = undefined;
	});

	$effect(() => {
		if (!canvas || !match || !canvasImages || adjustIndex === undefined) {
			return;
		}

		if (adjustIndex !== undefined) {
			if (
				canvasImages[adjustIndex].settings.zoom !== settings.zoom ||
				canvasImages[adjustIndex].settings.x !== settings.x ||
				canvasImages[adjustIndex].settings.y !== settings.y
			) {
				canvasImages[adjustIndex].settings = { ...settings };

				matchCanvasRenderer(canvas as HTMLCanvasElement, match, mediaType, canvasImages);
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

			toast.success('Settings updated');
			goto(`/match/${matchId}/media/${mediaType}`);
		});
	}

	function resetSettings() {
		settings = {
			zoom: 1,
			x: 0,
			y: 0,
		};
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingMd>Adjust image</HeadingMd>

<canvas bind:this={canvas} width={1080} height={1350} class="w-full border border-slate-900"
></canvas>

<form onsubmit={updateUploadSettings} novalidate>
	<div class="mt-6">
		<label for="zoom" class="text-sm text-gray-500">Zoom</label>
		<input
			id="zoom"
			type="range"
			bind:value={settings.zoom}
			step=".1"
			min="1"
			max="20"
			class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700"
		/>
	</div>

	<div class="mt-6">
		<label for="horizontal" class="text-sm text-gray-500">Horizontal</label>
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
		<label for="vertical" class="text-sm text-gray-500">Vertical</label>
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
