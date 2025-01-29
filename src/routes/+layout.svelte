<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import { network } from '$lib/stores/NetworkStore.svelte';
	import { onDestroy, onMount } from 'svelte';
	// import PlayerImageWorker from '$lib/workers/PlayerImage.worker.ts?worker';
	import ClubWorker from '$lib/workers/ClubImage.worker.ts?worker';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

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
		if (requiredClubImages.length > 0 && clubWorker) {
			clubWorker.postMessage(JSON.parse(JSON.stringify(requiredClubImages)));
		}
	});

	onDestroy(() => {
		clubWorker.terminate();
	});
</script>

<svelte:window ononline={handleOnline} onoffline={handleOffline} />
<ModeWatcher />
<Toaster position="bottom-center" />
<!-- <Toast /> -->
<Navbar />
<div class="flex min-h-full justify-center">
	<div class=" w-full max-w-sm">
		<div class="mt-2 grid grid-cols-1 gap-2">
			{@render children()}
		</div>
	</div>
</div>
