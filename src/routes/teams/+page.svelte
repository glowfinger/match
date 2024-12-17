<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import TeamCard from '$lib/components/cards/TeamCard.svelte';
	import { Teams } from '$lib/data/Teams';

    const breadcrumbs = [{ name: 'Home', href: '/' }];
</script>

<div class="grid grid-cols-1 gap-2">
	<h1 class="h1">Matches</h1>
	<Breadcrumb {breadcrumbs} />
	<h1 class="h1">Teams</h1>
	{#each Teams as team}
		<TeamCard {team} />
	{/each}
</div>
