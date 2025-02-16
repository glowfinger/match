<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import MatchPositionCard from '$lib/components/cards/MatchPositionCard.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { SHIRT_NUMBERS } from '$lib/counts/PlayerCounts';
	import type { Match, MatchPosition, Player } from '$lib/database/IndexedDB';
	import { getMatchPositions } from '$lib/database/MatchPositionDBService';
	import { setRole, unSetMatchRole } from '$lib/database/MatchRoleDBService';
	import { getMatch } from '$lib/database/MatchService';
	import { getPlayers } from '$lib/database/PlayerDBService';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

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
		match = await getMatch(matchId);
		players = await getPlayers();

		matchPositions = await getMatchPositions(matchId);
	});

	function getPlayerByPosition(position: string): Player | null {
		const found =
			matchPositions.find(
				(matchPosition) => matchPosition.position === position && matchPosition.type === 'start',
			)?.playerKey ?? null;

		return players.find((player) => player.key === found) ?? null;
	}

	async function saveRole(playerKey: string, matchId: number, roleKey: string) {
		await setRole(playerKey, matchId, roleKey);
		const player = players.find((player) => player.key === playerKey);
		const role = roles.find((role) => role.value === roleKey);
		toast.success(`Set ${player?.bio.first} ${player?.bio.last} as ${role?.label}`);
		goto(`/match/${matchId}/roles`);
	}

	async function removeRole(matchId: number, roleKey: string) {
		await unSetMatchRole(matchId, roleKey);
		toast.success(`${role?.label} removed`);
		goto(`/match/${matchId}/roles`);
	}
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
		<button class="block w-full" onclick={() => removeRole(matchId, roleId)}> Remove</button>

		{#each [...SHIRT_NUMBERS] as [positionNumber, positionName]}
			<button
				class="block w-full"
				onclick={() => saveRole(getPlayerByPosition(positionNumber)?.key ?? '', matchId, roleId)}
			>
				{getPlayerByPosition(positionNumber)?.bio.screen ?? 'Select player'}</button
			>
		{/each}
	</div>
{/if}
