<script lang="ts">
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import { network } from '$lib/stores/NetworkStore.svelte';
	import { onMount } from 'svelte';
	// import PlayerImageWorker from '$lib/workers/PlayerImage.worker.ts?worker';
	// import ClubWorker from '$lib/workers/PlayerImageLoader.ts?worker';
	import '../app.css';

	let { children } = $props();

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

		// playerImageWorker = new PlayerImageWorker();
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
