<script lang="ts">
	import { page } from '$app/state';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import MatchRoleCard from '$lib/components/cards/MatchRoleCard.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';

	const matchId = Number.parseInt(page.params.id);
	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: 'Roles', href: `/match/${matchId}/roles` },
	];

	const roles = [
		{ label: 'Captain', value: 'captain' },
		{ label: 'Vice Captain', value: 'vice-captain' },
		{ label: 'Pack leader', value: 'pack-leader' },
	];
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Manage roles</HeadingLg>
<Separator />

<HeadingMd>Roles</HeadingMd>
{#each roles as role}
	<MatchRoleCard {matchId} {role} />
{/each}
