<script lang="ts">
	import { page } from '$app/state';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { MediaImageTypes, type MediaImageType } from '$lib/Constants';
	import { type ImageUpload, type Match, type MatchImage } from '$lib/database/IndexedDB';
	import { getImagesByMatch } from '$lib/database/match/MatchImageDBService';
	import { getMatch } from '$lib/database/MatchService';
	import { onMount } from 'svelte';
	import FortIcon from '$lib/components/icons/FortIcon.svelte';
	import MediaCard from '$lib/components/cards/MediaCard.svelte';
	import { getUploadsByMatchAndMedia } from '$lib/database/match/ImageUploadDBService';

	const matchId = Number.parseInt(page.params.id as string);
	const mediaType = page.params.mediaType as string;
	const mediaLabel = MediaImageTypes.find((m) => m.type === mediaType)?.label;

	if (!mediaLabel) {
		throw new Error('Media type is required');
	}

	let match: Match | undefined = $state();
	let images: MatchImage[] = $state([]);
	let uploads: ImageUpload[] = $state([]);

	onMount(async () => {
		[match, images, uploads] = await Promise.all([
			getMatch(matchId),
			getImagesByMatch(matchId),
			getUploadsByMatchAndMedia(matchId, mediaType),
		]);
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: 'Media', href: `/match/${matchId}/media` },
		{ name: mediaLabel, href: `/match/${matchId}/media/${mediaType}` },
	];

	const PHOTO_LINKS = [
		{ label: mediaLabel, href: `/match/${matchId}/media/${mediaType}/upload/main`, icon: FortIcon },
	];

	function getImages(type: string) {
		return images.filter((image) => image.type === type);
	}

	function getGeneratedImageTypes() {
		return MediaImageTypes.filter((type) => getImages(type.type).length > 0);
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>View media</HeadingLg>
<HeadingMd>Post</HeadingMd>

{#each getGeneratedImageTypes() as type}
	<HeadingMd>{type.label}</HeadingMd>

	{#if getImages(type.type).length > 0}
		<div class="grid grid-cols-2">
			{#each getImages(type.type) as image}
				<a href={`/match/${matchId}/media/${type.type}/upload/main/adjust`}>
					<img src={image.base64} alt={type.label} />
				</a>
			{/each}
		</div>
	{/if}
{:else}
	no images
{/each}

{#if uploads.length > 0}
	<HeadingMd>Uploads</HeadingMd>
	<div class="grid grid-cols-4">
		{#each uploads as upload}
			<a href={`/match/${matchId}/media/${mediaType}/upload/${upload.uploadType}`}>
				<img src={URL.createObjectURL(upload.blob)} alt={upload.uploadType} />
			</a>
		{/each}
	</div>
{/if}

<ul role="list" class="grid grid-cols-4 gap-2">
	{#each PHOTO_LINKS as link}
		<MediaCard {link} image={images.find((image) => image.type === link.href)} />
	{/each}
</ul>
