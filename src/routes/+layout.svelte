<script lang="ts">
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import { network } from '$lib/stores/NetworkStore.svelte';
	import { onDestroy, onMount } from 'svelte';
	// import PlayerImageWorker from '$lib/workers/PlayerImage.worker.ts?worker';
	import ClubWorker from '$lib/workers/ClubImage.worker.ts?worker';
	import '../app.css';

	import { requiredClubImages } from '$lib/stores/BlobStore.svelte';

	let { children } = $props();

	let clubWorker: Worker = new ClubWorker();

	let playerImageWorker: Worker;

	function handleOnline() {
		network.online = true;
	}

	function handleOffline() {
		network.online = false;
	}

	onMount(async () => {
		if (navigator.storage && navigator.storage.estimate) {
			const estimation = await navigator.storage.estimate();
			console.log(`Quota: ${estimation.quota}`);
			console.log(`Usage: ${estimation.usage}`);
		} else {
			console.error('StorageManager not found');
		}
	});

	$effect(() => {
		// if (requiredClubImages.length > 0 && clubWorker) {
		clubWorker.postMessage(JSON.parse(JSON.stringify(requiredClubImages)));
		// }
	});

	onDestroy(() => {
		clubWorker.terminate();
	});
</script>

<svelte:window ononline={handleOnline} onoffline={handleOffline} />
<!-- <Toast /> -->
<Navbar />
<div class="flex min-h-full justify-center">
	<div class=" w-full max-w-sm px-2">
		{@render children()}
	</div>
</div>
