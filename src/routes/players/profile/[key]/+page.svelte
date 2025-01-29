<script lang="ts">
	import { page } from '$app/stores';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getPlayer } from '$lib/database/PlayerDBService';
	import type { Player } from '$lib/database/IndexedDB';

	import { onMount } from 'svelte';

	const { key } = $page.params;

	let player: Player | undefined = $state();

	onMount(async () => {
		player = await getPlayer(key);
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Players', href: '/players' },
		{ name: 'Profile', href: `/players/load/${key}` },
	];
</script>

<Breadcrumb {breadcrumbs} />

<h1 class="h1">Profile</h1>

{#if !player}
	<p>Player not found</p>
{:else}
	<h1 class="h1">{player.bio.first} {player.bio.last}</h1>
	<p>{player.bio.screen}</p>
	<p>{player.key}</p>
	<pre>{JSON.stringify(player, null, 2)}</pre>
{/if}
