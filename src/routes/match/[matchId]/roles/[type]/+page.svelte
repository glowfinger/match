<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import MatchRoleCard from '$lib/components/cards/MatchRoleCard.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { AllRoles } from '$lib/data/MatchRoles';
	import type { MatchRole, Player } from '$lib/database/IndexedDB';
	import { getMatchRoles } from '$lib/database/MatchRoleDBService';

	import { getPlayers } from '$lib/database/PlayerDBService';
	import { onMount } from 'svelte';
	import type { LayoutProps } from '../../$types';

	let props: LayoutProps = $props();
	let matchId = props.data.matchId;
	let matchTile = props.data.matchTile;
	let typeKey: string = props.params.type ?? '';

	let roles: MatchRole[] = $state([]);
	let players: Player[] = $state([]);

	const roleOptions = AllRoles.filter((role) => role.type === typeKey);

	type Role = {
		label: string;
		value: string;
		type: string;
	};

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: matchTile, href: `/match/${matchId}` },
		{
			name: typeKey.charAt(0).toUpperCase() + typeKey.slice(1),
			href: `/match/${matchId}/roles/${typeKey}`,
		},
	];

	onMount(async () => {
		players = await getPlayers();
		roles = await getMatchRoles(matchId);
	});

	function rowMapper(award: Role) {
		const matchAward = roles.find((role) => role.type === award.type && role.role === award.value);

		return {
			matchId: matchId,
			player: players.find((player) => player.key === matchAward?.playerKey),
			role: award,
			to: `/match/${matchId}/roles/${typeKey}/${award.value}`,
		};
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Manage roles</HeadingLg>
<Separator />

<HeadingMd>Roles</HeadingMd>

<ul role="list" class="grid grid-cols-1 gap-2">
	{#each roleOptions.map(rowMapper) as { matchId, player, role, to }}
		<MatchRoleCard {to} {player} {matchId} {role} />
	{/each}
</ul>
<Separator class="border-t-1 border-b-1 border-t-slate-100 border-b-slate-400" />
<Button href={`/match/${matchId}`} variant="outline">Cancel</Button>
