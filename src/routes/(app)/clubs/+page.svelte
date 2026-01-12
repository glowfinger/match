<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import ClubCard from '$lib/components/cards/club/ClubCard.svelte';
	import TextInput from '$lib/components/forms/TextInput.svelte';
	import { addClubs, clearClubs, getClubs } from '$lib/database/ClubDbService';
	import type { Club } from '$lib/database/IndexedDB';
	import { getApiClubs } from '$lib/services/api/ClubApiService';
	import { requiredClubImages } from '$lib/stores/BlobStore.svelte';
	import filterClubs from '$lib/filters/ClubFilter';
	import { onMount } from 'svelte';

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Clubs', href: '/clubs' },
	];

	let clubs: Club[] = $state([]);
	let filteredClubs: Club[] = $state([]);
	let search = $state('');
	let loading = $state(false);
	let error = $state(false);

	$effect(() => {
		filteredClubs = filterClubs(clubs, search);
	});

	onMount(async () => {
		loading = true;
		clubs = await getClubs();

		if (clubs.length === 0) {
			const apiClubs = await getApiClubs();
			await addClubs(apiClubs);
			clubs = await getClubs();
			requiredClubImages.push(...clubs);
		}

		loading = false;
	});
</script>

<Breadcrumb {breadcrumbs} />
<TextInput id="search" title="Search" placeholder="Search for a club" bind:value={search} />

{#if loading}
	<p>Loading...</p>
{:else if error}
	<p>Error loading clubs</p>
{:else if clubs.length === 0}
	<p>No clubs found</p>
{:else}
	<div class="grid grid-cols-3 gap-4 lg:grid-cols-4">
		{#each filteredClubs as club}
			<ClubCard {club} />
		{/each}
	</div>
{/if}
