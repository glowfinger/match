<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import { onDestroy, onMount } from 'svelte';
	// import PlayerImageWorker from '$lib/workers/PlayerImage.worker.ts?worker';
	import ClubWorker from '$lib/workers/ClubImage.worker.ts?worker';
	import { Toaster, toast } from 'svelte-sonner';

	import ImageWorker from '$lib/workers/Image.worker.ts?worker';
	import { requiredClubImages } from '$lib/stores/BlobStore.svelte';
	import { addClubs, getClubs } from '$lib/database/ClubDbService';
	import { getApiClubs } from '$lib/services/api/ClubApiService';
	import { addPlayers, getPlayers } from '$lib/database/PlayerDBService';
	import { getApiPlayers } from '$lib/services/api/PlayerApiService';
	import { addFonts, getFonts, hasFonts } from '$lib/database/FontDBService';

	let { children } = $props();
	let clubWorker: Worker = new ClubWorker();
	let imageWorker: Worker = new ImageWorker();

	// let playerImageWorker: Worker;

	let loading = $state(false);
	let error = $state(false);
	onMount(async () => {
		loading = true;

		if (!(await hasFonts())) {
			await addFonts();

			toast('Added fonts');
		}

		const fonts = await getFonts();

		for await (const font of fonts) {
			await new FontFace(font.type, font.blob).load().then((font) => {
				document.fonts.add(font);
			});
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
		imageWorker.terminate();
	});

	function clearFonts() {
		// throw new Error('Function not implemented.');
	}
</script>

<ModeWatcher />
<Toaster position="bottom-center" />

<Navbar />

{#if loading}
	<p>Loading...</p>
{:else if error}
	<p>Error loading clubs</p>
{:else}
	<div class="flex min-h-full justify-center">
		<div class="w-full max-w-md min-w-xs border-x border-slate-400 p-4 shadow-lg">
			<div class="grid grid-cols-1 gap-2">
				{@render children()}
			</div>
		</div>
	</div>
{/if}
