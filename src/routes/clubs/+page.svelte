<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import ClubCard from '$lib/components/cards/ClubCard.svelte';
	import { addClubs, clearClubs, getClubs } from '$lib/database/ClubDbService';
	import type { Club } from '$lib/database/IndexedDB';
	import { getApiClubs } from '$lib/services/api/ClubApiService';

	import { onMount } from 'svelte';

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Teams', href: '/clubs' },
	];

	let clubs: Club[] = $state([]);

	let loading = $state(false);
	let error = $state(false);

	async function handleLoadClubs() {
		loading = true;
		try {
			await clearClubs();
			const apiClubs = await getApiClubs();
			await addClubs(apiClubs);
			clubs = await getClubs();
		} catch (e) {
			error = true;
		}
		loading = false;
	}

	onMount(async () => {
		loading = true;
		clubs = await getClubs();

		if (clubs.length === 0) {
			const apiClubs = await getApiClubs();
			await addClubs(apiClubs);
			clubs = await getClubs();
		}

		loading = false;
	});
</script>

<div class="grid grid-cols-1 gap-2">
	<h1 class="h1">Clubs</h1>
	<Breadcrumb {breadcrumbs} />
	<button onclick={handleLoadClubs} class="variant-filled-primary btn">Load clubs</button>

	{#if loading}
		<p>Loading...</p>
	{:else if error}
		<p>Error loading clubs</p>
	{:else if clubs.length === 0}
		<p>No clubs found</p>
	{:else}
		{#each clubs as club}
			<ClubCard {club} />
		{/each}
	{/if}
</div>
