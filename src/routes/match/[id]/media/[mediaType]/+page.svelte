<script lang="ts">
	import { page } from '$app/state';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { MediaImageTypes, type MediaImageType } from '$lib/Constants';
	import { type Match, type MatchImage, type Player } from '$lib/database/IndexedDB';
	import {
		getImagesByMatch,
		getImagesByMatchAndType,
	} from '$lib/database/match/MatchImageDBService';
	import { getMatch } from '$lib/database/MatchService';
	import { onMount } from 'svelte';
	import FortIcon from '$lib/components/icons/FortIcon.svelte';
	import { getMatchRolesByType } from '$lib/database/MatchRoleDBService';
	import { getPlayer } from '$lib/database/PlayerDBService';
	import { goto } from '$app/navigation';
	import type { LayoutProps } from '../../$types';
	import { convertTime, matchDate } from '$lib/helpers/dateTime/ConvertTime';

	let { data }: LayoutProps = $props();
	const { matchId, match, matchTile } = data;
	const mediaType = page.params.mediaType as string;
	const uploadType = page.params.uploadType as string;
	const mediaLabel = MediaImageTypes.find((m) => m.type === mediaType)?.label;

	if (!mediaLabel) {
		throw new Error('Media type is required');
	}

	let images: MatchImage[] = $state([]);
	let activeImageIndex: number | undefined = $state();

	let forwardsMOTM: Player | undefined = $state();
	let backsMOTM: Player | undefined = $state();
	let jointMOTM: Player | undefined = $state();

	onMount(async () => {
		[images] = await Promise.all([getImagesByMatchAndType(matchId, mediaType)]);

		if (images.length === 0) {
			// goto(`/match/${matchId}/media/${mediaType}/render`);
			// return;
		}

		const awards = await getMatchRolesByType(matchId, 'awards');
		if (awards.length === 0) {
			return;
		}

		const forwardsMOTMKey = awards.find((award) => award.role === 'forwards-motm')?.playerKey;
		if (forwardsMOTMKey) {
			forwardsMOTM = await getPlayer(forwardsMOTMKey);
		}
		const backsMOTMKey = awards.find((award) => award.role === 'backs-motm')?.playerKey;
		if (backsMOTMKey) {
			backsMOTM = await getPlayer(backsMOTMKey);
		}

		const jointMOTMKey = awards.find((award) => award.role === 'motm')?.playerKey;
		if (jointMOTMKey) {
			jointMOTM = await getPlayer(jointMOTMKey);
		}
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: matchTile, href: `/match/${matchId}` },
		{ name: 'Media', href: `/match/${matchId}/media` },
		{ name: mediaLabel, href: `/match/${matchId}/media/${mediaType}` },
	];

	const PHOTO_LINKS = [
		{ label: mediaLabel, href: `/match/${matchId}/media/${mediaType}/upload/main`, icon: FortIcon },
	];

	function getImages(type: string) {
		return images.filter((image) => image.type === type);
	}

	function getGeneratedImageTypes() {
		return MediaImageTypes.filter((type) => getImages(type.type).length > 0);
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Media: {mediaLabel}</HeadingLg>
<HeadingMd>Images</HeadingMd>
<div class="-mb-2 grid grid-cols-4 border border-slate-900">
	{#each images as image, i}
		<button class="inline-block overflow-hidden" onclick={() => (activeImageIndex = i)}>
			<img
				src={image.base64}
				alt={image.type}
				class="transform transition-transform duration-300 hover:scale-105 hover:opacity-75"
			/>
		</button>
	{/each}
</div>
<div class="grid grid-cols-4 border-x border-b border-slate-900">
	{#each images as image, i}
		{#if activeImageIndex === i}
			<div class="h-1 bg-slate-400"></div>
		{:else}
			<div class="bg-transparent"></div>
		{/if}
	{/each}
</div>

{#if activeImageIndex !== undefined}
	<div class="border border-slate-900">
		<img src={images[activeImageIndex].base64} alt={images[activeImageIndex].type} />
	</div>
{/if}

<a href={`/match/${matchId}/media/${mediaType}/upload/main/adjust`}>Adjust</a>
<a href={`/match/${matchId}/media/${mediaType}/upload/main`}>Upload</a>
<a href={`/match/${matchId}/media/${mediaType}/render`}>Render</a>

{#if (mediaType === 'RESULT' || mediaType === 'LINEUP') && match}
	<div>
		{#if mediaType === 'LINEUP'}
			<p>🚨 1XV Lineup Announced 🚨</p>
		{/if}

		{#if match.detail?.venue === 'HOME'}
			<p>
				{match.team?.club ?? ''}
				{match.team?.squad ?? ''}
				{match.result?.homeScore ?? ''} vs {match.result?.awayScore ?? ''}
				{match.opponent?.club ?? ''}
				{match.opponent?.squad ?? ''}
			</p>
		{/if}
		{#if match.detail?.venue === 'AWAY'}
			<p>
				{match.opponent?.club ?? ''}
				{match.opponent?.squad ?? ''}
				{match.result?.homeScore ?? ''} vs {match.result?.awayScore ?? ''}
				{match.team?.club ?? ''}
				{match.team?.squad ?? ''}
			</p>
		{/if}

		<p>
			{#if match.schedule?.matchOn}
				📅 {matchDate(match.schedule?.matchOn)}
			{/if}
		</p>
		<p>
			{#if match.schedule?.meetAt}
				⏰ Meet: {convertTime(match.schedule.meetAt ?? '')} - KO: {convertTime(
					match.schedule.kickOffAt ?? '',
				)}
			{/if}
		</p>
		<p>
			{#if match.detail?.address}
				🏟️ {match.detail?.address}
			{/if}
		</p>
	</div>
{/if}
{#if jointMOTM}
	<div>
		{#if jointMOTM && jointMOTM.social.instagram}
			<p>MOTM: @{jointMOTM.social.instagram}</p>
		{/if}
		{#if jointMOTM && !jointMOTM.social.instagram}
			<p>MOTM: {jointMOTM.bio.screen}</p>
		{/if}
	</div>
{/if}

{#if forwardsMOTM || backsMOTM}
	<div>
		{#if forwardsMOTM && forwardsMOTM.social.instagram}
			<p>Forwards MOTM: @{forwardsMOTM.social.instagram}</p>
		{/if}
		{#if backsMOTM && backsMOTM.social.instagram}
			<p>Backs MOTM: @{backsMOTM.social.instagram}</p>
		{/if}
	</div>
	<div>
		{#if forwardsMOTM && !forwardsMOTM.social.instagram}
			<p>Forwards MOTM: {forwardsMOTM.bio.screen}</p>
		{/if}
		{#if backsMOTM && !backsMOTM.social.instagram}
			<p>Backs MOTM: {backsMOTM.bio.screen}</p>
		{/if}
	</div>
{/if}
<div>
	<p>#UTC #FortressMeads #rugbyunion</p>
</div>
<div>
	<p>Sponsored by: @furniturevillage @formation_lighting</p>
</div>
