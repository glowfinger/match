<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import MatchRoleCard from '$lib/components/cards/MatchRoleCard.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import type { MatchRole } from '$lib/database/IndexedDB';
	import { getMatchRoles } from '$lib/database/MatchRoleDBService';
	import { getPlayers } from '$lib/database/PlayerDBService';
	import { onMount } from 'svelte';

	let matchRoles: MatchRole[] = $state([]);
	let players: Player[] = $state([]);

	type Role = {
		label: string;
		value: string;
	};

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

	function handleCardClick(roleKey: string) {
		goto(`/match/${matchId}/roles/${roleKey}`);
	}

	onMount(async () => {
		matchRoles = await getMatchRoles(matchId);
		// match = await getMatch(matchId);
		players = await getPlayers();

		// matchPositions = await getMatchPositions(matchId);
	});

	function roleRowMapper(role: Role) {
		const matchRole = matchRoles.find((matchRole) => matchRole.role === role.value);

		return {
			matchId: matchId,
			player: players.find((player) => player.key === matchRole?.playerKey),
			role: role,
			to: `/match/${matchId}/roles/${role.value}`,
		};
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Manage roles</HeadingLg>
<Separator />

<HeadingMd>Roles</HeadingMd>

<ul role="list" class="grid grid-cols-1 gap-2">
	{#each roles.map(roleRowMapper) as { matchId, player, role, to }}
		<MatchRoleCard {to} {player} {matchId} {role} />
	{/each}
</ul>
