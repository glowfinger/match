<script lang="ts">
	import { page } from '$app/stores';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getMatchPositions } from '$lib/database/MatchPositionDBService';
	import { getMatch } from '$lib/database/MatchService';
	import { getPlayers } from '$lib/database/PlayerDBService';
	import { getSelections } from '$lib/database/SelectionDBService';
	import { isAvailable } from '$lib/filters/SelectionFilter';
	import type { Match, MatchPosition, Player, Selection } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	const matchId = Number.parseInt($page.params.id);

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: 'Images', href: `/match/${matchId}/images` },
	];

	let match: Match | undefined = $state();
	let players: Player[] = $state([]);
	let replacements: Player[] = $state([]);
	let selections: Selection[] = $state([]);
	let matchPositions: MatchPosition[] = $state([]);

	onMount(async () => {
		const allPlayer = await getPlayers();

		match = await getMatch(Number.parseInt($page.params.id));

		selections = (await getSelections(matchId)).filter(isAvailable);
		players = allPlayer.filter((player) =>
			selections.some((selection) => selection.playerKey === player.key),
		);

		matchPositions = await getMatchPositions(matchId);

		replacements = allPlayer
			.filter((player) => selections.some((selection) => selection.playerKey === player.key))
			.filter(
				(player) =>
					matchPositions.filter(
						(position) => position.playerKey === player.key && position.type === 'start',
					).length === 0,
			);
	});
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Media</HeadingLg>
