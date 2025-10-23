<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getMatch } from '$lib/database/MatchService';
	import { getPlayers } from '$lib/database/PlayerDBService';
	import { getSelections } from '$lib/database/SelectionDBService';
	import { isAvailable } from '$lib/filters/SelectionFilter';
	import type { Match, Player, Selection } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { page } from '$app/state';
	import MatchCard from '$lib/components/cards/MatchCard.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import LinkCard from '$lib/components/cards/LinkCard.svelte';
	import StadiumIcon from '$lib/components/icons/StadiumIcon.svelte';
	import CalendarIcon from '$lib/components/icons/CalendarIcon.svelte';
	import FortIcon from '$lib/components/icons/FortIcon.svelte';
	import SwordIcon from '$lib/components/icons/SwordIcon.svelte';
	import ArticlePersonIcon from '$lib/components/icons/ArticlePersonIcon.svelte';
	import ArticleIcon from '$lib/components/icons/ArticleIcon.svelte';
	import SocialLeaderboardIcon from '$lib/components/icons/SocialLeaderboardIcon.svelte';
	import AwardStarIcon from '$lib/components/icons/AwardStarIcon.svelte';
	import StarShineIcon from '$lib/components/icons/StarShineIcon.svelte';
	import SportsScoreIcon from '$lib/components/icons/SportsScoreIcon.svelte';
	import ErrorIcon from '$lib/components/icons/ErrorIcon.svelte';
	import { getImagesByMatch } from '$lib/database/match/MatchImageDBService';
	import type { MatchImage } from '$lib/database/IndexedDB';
	import MediaCard from '$lib/components/cards/MediaCard.svelte';
	import { MediaImageTypes, type MediaImageType } from '$lib/Constants';
	if (!page.params.id) {
		throw new Error('Match ID is required');
	}

	const matchId = Number.parseInt(page.params.id);

	let match: Match | undefined = $state();
	let players: Player[] = $state([]);
	let selections: Selection[] = $state([]);
	let images: MatchImage[] = $state([]);

	onMount(async () => {
		match = await getMatch(matchId);

		selections = (await getSelections(matchId)).filter(isAvailable);
		players = (await getPlayers()).filter((player) =>
			selections.some((selection) => selection.playerKey === player.key),
		);

		images = await getImagesByMatch(matchId);
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
	];

	const INFO_LINKS = [
		{ label: 'Team', href: `/match/${matchId}/team`, icon: FortIcon },
		{ label: 'Opposition', href: `/match/${matchId}/opposition`, icon: SwordIcon },
		{ label: 'Details', href: `/match/${matchId}/details`, icon: StadiumIcon },
		{ label: 'Schedule', href: `/match/${matchId}/schedule`, icon: CalendarIcon },
	];

	const MANAGE_LINKS = [
		{ label: 'Squad', href: `/match/${matchId}/squad`, icon: ArticlePersonIcon },
		{ label: 'Lineup', href: `/match/${matchId}/lineup`, icon: ArticleIcon },
		{
			label: 'Leadership',
			href: `/match/${matchId}/roles/leadership`,
			icon: SocialLeaderboardIcon,
		},
		{ label: 'Awards', href: `/match/${matchId}/roles/awards`, icon: AwardStarIcon },
		{ label: 'Debuts', href: `/match/${matchId}/debuts`, icon: StarShineIcon },
		{ label: 'Result', href: `/match/${matchId}/result`, icon: SportsScoreIcon },
	];

	const MEDIA_LINKS = MediaImageTypes.map((type) => mediaMapper(type));

	function mediaMapper(type: MediaImageType) {
		return {
			label: type.label,
			href: `/match/${matchId}/media/${type.type}`,
			type: type.type,
		};
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Match</HeadingLg>
{#if !match}
	<p>Match not found</p>
{:else}
	<div class="grid grid-cols-2 gap-2">
		<MatchCard {match} />
	</div>
	<Separator />
	<HeadingMd>Info</HeadingMd>
	<ul role="list" class="grid grid-cols-4 gap-2">
		{#each INFO_LINKS as link}
			<LinkCard {link} />
		{/each}
	</ul>
	<Separator />

	<HeadingMd>Manage</HeadingMd>
	<ul role="list" class="grid grid-cols-4 gap-2">
		{#each MANAGE_LINKS as link}
			<LinkCard {link} />
		{/each}
	</ul>
	<Separator />

	<HeadingMd>Media</HeadingMd>
	<ul role="list" class="grid grid-cols-4 gap-2">
		{#each MEDIA_LINKS as link}
			<MediaCard {link} image={images.find((image) => image.type === link.type)} />
		{/each}
	</ul>
	<Separator />

	<HeadingMd>Analysis</HeadingMd>
	<a href={`/match/${match.id}/analysis`} class="variant-filled-primary btn">Analysis dashboad</a>
	<HeadingMd>Admin</HeadingMd>
	<a href={`/match/${match.id}/remove`} class="variant-filled-primary btn">Remove match</a>
{/if}
