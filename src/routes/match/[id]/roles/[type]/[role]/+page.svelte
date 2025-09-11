<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import MatchPositionCard from '$lib/components/cards/MatchPositionCard.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { SHIRT_NUMBERS } from '$lib/counts/PlayerCounts';
	import { AllRoles } from '$lib/data/MatchRoles';
	import type { Match, MatchPosition, Player, Selection } from '$lib/database/IndexedDB';
	import { getMatchPositions } from '$lib/database/MatchPositionDBService';
	import { setMatchRole, unSetMatchRole } from '$lib/database/MatchRoleDBService';
	import { getMatch } from '$lib/database/MatchService';
	import { getPlayers } from '$lib/database/PlayerDBService';
	import { getSelections } from '$lib/database/SelectionDBService';
	import { isAvailable } from '$lib/filters/SelectionFilter';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	const matchId = Number.parseInt(page.params.id as string);
	const typeKey = page.params.type as string;
	const roleKey = page.params.role as string;

	let match: Match | undefined = $state();
	let players: Player[] = $state([]);
	let matchPositions: MatchPosition[] = $state([]);
	let selections: Selection[] = $state([]);

	const awards = AllRoles;

	const award = awards.find((award) => award.value === roleKey && award.type === typeKey);
	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: 'Awards', href: `/match/${matchId}/roles/${typeKey}` },
		{ name: award?.label, href: `/match/${matchId}/roles/${typeKey}/${roleKey}` },
	];

	onMount(async () => {
		match = await getMatch(matchId);
		selections = (await getSelections(matchId)).filter(isAvailable);
		players = (await getPlayers())
			.filter((player) => selections.some((selection) => selection.playerKey === player.key))
			.toSorted((a, b) => a.bio.screen.localeCompare(b.bio.screen));
		matchPositions = await getMatchPositions(matchId);
	});

	function getPlayerByPosition(position: string): Player | null {
		const found =
			matchPositions.find(
				(matchPosition) => matchPosition.position === position && matchPosition.type === 'start',
			)?.playerKey ?? null;

		return players.find((player) => player.key === found) ?? null;
	}

	async function saveRole(playerKey: string, matchId: number, awardKey: string, typeKey: string) {
		await setMatchRole(playerKey, matchId, typeKey, awardKey);
		const player = players.find((player) => player.key === playerKey);
		toast.success(`Set ${player?.bio.first} ${player?.bio.last} as ${award?.label}`);
		goto(`/match/${matchId}/roles/${typeKey}`);
	}

	async function removeRole(matchId: number, awardKey: string, typeKey: string) {
		await unSetMatchRole(matchId, awardKey, typeKey);
		toast.success(`${award?.label} removed`);
		goto(`/match/${matchId}/roles/${typeKey}`);
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Set {award?.label}</HeadingLg>
<Separator />

{#if !match}
	<p>Match not found</p>
{:else if players.length === 0}
	<p>No players selected</p>
{:else}
	<div class="grid grid-cols-3 gap-2">
		<button class="block w-full" onclick={() => removeRole(matchId, award?.value ?? '', typeKey)}>
			Remove</button
		>

		{#each players as player}
			<button
				class="block w-full"
				onclick={() => saveRole(player.key, matchId, award?.value ?? '', typeKey)}
			>
				{player.bio.screen}
			</button>
		{/each}
	</div>
{/if}
