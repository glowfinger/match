<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import MatchCard from '$lib/components/cards/MatchCard.svelte';
	import { addMatch, deleteMatch, getMatches } from '$lib/database/MatchService';
	import type { Match } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { goto } from '$app/navigation';
	import Sonner from '$lib/components/ui/sonner/sonner.svelte';
	import { toast } from 'svelte-sonner';
	import {
		deleteImageFiles,
		getImageFileCount,
		getImageFiles,
		getImageFileSize,
	} from '$lib/database/services/ImageFileDbService';
	import type { ImageFile } from '$lib/database/IndexedDB';
	let matches: Match[] = $state([]);
	let emptyMatches: Match[] = $state([]);
	let imageFiles: ImageFile[] = $state([]);

	let imageFileInfo: { count: number; size: number } = $state({ count: 0, size: 0 });

	onMount(async () => {
		matches = await getMatches();
		emptyMatches = matches.filter(isNewMatch);
		imageFiles = await getImageFiles();

		imageFileInfo = { count: await getImageFileCount(), size: await getImageFileSize() };
	});

	function isNewMatch(match: Match) {
		return Object.keys(match).length === 3;
	}

	async function handleClearEmptyMatches() {
		matches.filter(isNewMatch).forEach(async (match) => {
			await deleteMatch(match.id);
		});

		toast.success('Empty matches removed');
		matches = await getMatches();
		emptyMatches = matches.filter(isNewMatch);
	}

	async function handleClearEmptyImages() {
		await deleteImageFiles();
		imageFileInfo = { count: await getImageFileCount(), size: await getImageFileSize() };
		toast.success('Image cache cleared');
	}

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Admin', href: '/admin' },
	];

	// if (navigator.storage && navigator.storage.estimate) {
	// 	const estimation = await navigator.storage.estimate();
	// 	console.log(`Quota: ${estimation.quota}`);
	// 	console.log(`Usage: ${estimation.usage}`);
	// } else {
	// 	console.error('StorageManager not found');
	// }
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Admin</HeadingLg>

<HeadingMd>Matches</HeadingMd>
<p>This will remove matches that have no information set</p>
<Button variant="destructive" onclick={handleClearEmptyMatches}
	>Delete empty matches ({emptyMatches.length})</Button
>

<HeadingMd>Images cache ({imageFileInfo.count}) {imageFileInfo.size}</HeadingMd>

<Button variant="destructive" disabled={imageFileInfo.count === 0} onclick={handleClearEmptyImages}
	>Clear image cache</Button
>

<a href="/players" class="variant-filled-primary btn">View players</a>
<a href="/clubs" class="variant-filled-primary btn">View Clubs</a>
