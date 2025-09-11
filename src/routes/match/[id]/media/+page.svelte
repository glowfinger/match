<script lang="ts">
	import { page } from '$app/state';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getMatch } from '$lib/database/MatchService';
	import type { Match, MatchImage } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { getImagesByMatch } from '$lib/database/match/MatchImageDBService';
	import { MediaImageTypes } from '$lib/Constants';

	const matchId = Number.parseInt(page.params.id as string);
	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: 'Media', href: `/match/${matchId}/media` },
	];

	let match: Match | undefined = $state();

	let images: MatchImage[] = $state([]);

	onMount(async () => {
		match = await getMatch(matchId);
		getImagesByMatch(matchId).then((rows) => (images = rows));
	});

	function getImages(type: string) {
		return images.filter((image) => image.type === type);
	}

	function getGeneratedImageTypes() {
		return MediaImageTypes.filter((type) => getImages(type.type).length > 0);
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Media</HeadingLg>
<a href={`/match/${matchId}/media/add`}>Add image</a>

{#each getGeneratedImageTypes() as type}
	<HeadingMd>{type.label}</HeadingMd>

	{#if getImages(type.type).length > 0}
		<div class="grid grid-cols-2">
			{#each getImages(type.type) as image}
				<a href={`/match/${matchId}/media/${type.type}`}>
					<img src={image.base64} alt={type.label} />
				</a>
			{/each}
		</div>
	{/if}
{:else}
	no images
{/each}
