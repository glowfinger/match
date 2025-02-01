<script lang="ts">
	import { page } from '$app/state';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import MatchPositionCard from '$lib/components/cards/MatchPositionCard.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { SHIRT_NUMBERS } from '$lib/counts/PlayerCounts';
	import type { Match, MatchPosition, Player } from '$lib/database/IndexedDB';
	import { getMatchPositions } from '$lib/database/MatchPositionDBService';
	import { getMatch } from '$lib/database/MatchService';
	import { getPlayers } from '$lib/database/PlayerDBService';
	import { onMount } from 'svelte';

	const matchId = Number.parseInt(page.params.id);
	const roleId = page.params.roleId;

	let match: Match | undefined = $state();
	let players: Player[] = $state([]);
	let matchPositions: MatchPosition[] = $state([]);

	const roles = [
		{ label: 'Captain', value: 'captain' },
		{ label: 'Vice Captain', value: 'vice-captain' },
		{ label: 'Pack leader', value: 'pack-leader' },
	];

	const role = roles.find((role) => role.value === roleId);
	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: 'Roles', href: `/match/${matchId}/roles` },
		{ name: role?.label, href: `/match/${matchId}/roles/${roleId}` },
	];

	onMount(async () => {
		players = await getPlayers();
		match = await getMatch(matchId);
		matchPositions = await getMatchPositions(matchId);
	});

	function getPlayerByPosition(position: string): Player | null {
		const found =
			matchPositions.find(
				(matchPosition) => matchPosition.position === position && matchPosition.type === 'start',
			)?.playerKey ?? null;

		return players.find((player) => player.key === found) ?? null;
	}

	type MatchRoleData = {
		matchId: number;
		player: Player;
		role: {
			label: string;
			value: string;
		} | null;

		postion: {
			number: string;
			name: string;
		} | null;
	};
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Set {role?.label}</HeadingLg>
<Separator />

{#if !match}
	<p>Match not found</p>
{:else if players.length === 0}
	<p>No players selected</p>
{:else}
	<div class="grid grid-cols-1 gap-2">
		{#each [...SHIRT_NUMBERS] as [positionNumber, positionName]}
			<MatchPositionCard
				{matchId}
				{positionNumber}
				{positionName}
				player={getPlayerByPosition(positionNumber)}
			/>
		{/each}
	</div>
{/if}
