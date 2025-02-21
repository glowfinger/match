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
	import { addClubs, getClubs } from '$lib/database/ClubDbService';
	import { getApiClubs } from '$lib/services/api/ClubApiService';
	import { addPlayers, getPlayers } from '$lib/database/PlayerDBService';
	import { getApiPlayers } from '$lib/services/api/PlayerApiService';
	import { toast } from 'svelte-sonner';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/AppSidebar.svelte';

	import { addFonts, hasFonts } from '$lib/database/FontDBService';
	let { children } = $props();

	let clubWorker: Worker = new ClubWorker();

	let playerImageWorker: Worker;

	let loading = $state(false);
	let error = $state(false);

	function handleOnline() {
		network.online = true;
	}

	function handleOffline() {
		network.online = false;
	}

	onMount(async () => {
		loading = true;

		if (!(await hasFonts())) {
			await addFonts();
		}

		const clubs = await getClubs();
		const players = await getPlayers();

		if (clubs.length === 0 && players.length === 0) {
			const [apiClubs, apiPlayes] = await Promise.all([getApiClubs(), getApiPlayers()]);

			await addClubs(apiClubs);
			await addPlayers(apiPlayes.players);
			toast('Clubs and Players loaded');
		}

		loading = false;
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

<Navbar />

{#if loading}
	<p>Loading...</p>
{:else if error}
	<p>Error loading clubs</p>
{:else}
	<div class="m-2 flex min-h-full justify-center">
		<div class="w-full max-w-md">
			<div class="grid grid-cols-1 gap-2">
				{@render children()}
			</div>
		</div>
	</div>
{/if}
