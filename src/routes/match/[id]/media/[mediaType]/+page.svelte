<script lang="ts">
	import { page } from '$app/state';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';
	import { MediaImageTypes, type MediaImageType } from '$lib/Constants';
	import {
		type ImageUpload,
		type Match,
		type MatchImage,
		type Player,
	} from '$lib/database/IndexedDB';
	import {
		getImagesByMatch,
		getImagesByMatchAndType,
	} from '$lib/database/match/MatchImageDBService';
	import { getMatch } from '$lib/database/MatchService';
	import { onMount } from 'svelte';
	import FortIcon from '$lib/components/icons/FortIcon.svelte';
	import MediaCard from '$lib/components/cards/MediaCard.svelte';
	import {
		getUploadsByMatchAndMedia,
		hasUploadByMatchAndTypes,
		hasUploadByMatchIdAndMediaType,
	} from '$lib/database/match/ImageUploadDBService';
	import { goto } from '$app/navigation';
	import { getMatchRolesByType } from '$lib/database/MatchRoleDBService';
	import { getPlayer } from '$lib/database/PlayerDBService';

	const matchId = Number.parseInt(page.params.id as string);
	const mediaType = page.params.mediaType as string;
	const uploadType = page.params.uploadType as string;
	const mediaLabel = MediaImageTypes.find((m) => m.type === mediaType)?.label;

	if (!mediaLabel) {
		throw new Error('Media type is required');
	}

	let match: Match | undefined = $state();
	let images: MatchImage[] = $state([]);
	let uploads: MatchImage[] = $state([]);

	let forwardsMOTM: Player | undefined = $state();
	let backsMOTM: Player | undefined = $state();
	let jointMOTM: Player | undefined = $state();

	onMount(async () => {
		[match, images, uploads] = await Promise.all([
			getMatch(matchId),
			getImagesByMatch(matchId),
			getImagesByMatchAndType(matchId, mediaType),
		]);

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
		{ name: 'Match', href: `/match/${matchId}` },
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
<HeadingLg>View media</HeadingLg>
<HeadingMd>Post</HeadingMd>

{#if mediaType === 'RESULT' && match}
	<div>
		{#if match.detail?.venue === 'HOME'}
			<p>
				{match.team?.club ?? ''}
				{match.team?.squad ?? ''}
				{match.result?.homeScore ?? ''} - {match.result?.awayScore ?? ''}
				{match.opponent?.club ?? ''}
				{match.opponent?.squad ?? ''}
			</p>
		{/if}
		{#if match.detail?.venue === 'AWAY'}
			<p>
				{match.opponent?.club ?? ''}
				{match.opponent?.squad ?? ''}
				{match.result?.homeScore ?? ''} - {match.result?.awayScore ?? ''}
				{match.team?.club ?? ''}
				{match.team?.squad ?? ''}
			</p>
		{/if}
	</div>

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
		<p>#UTC #FortressMeads #UTC #rugbyunion #chipsteadrfc</p>
	</div>
	<div>
		<p>Sponsored by: @furniturevillage @formation_lighting</p>
	</div>
{/if}

{#each getGeneratedImageTypes() as type}
	<HeadingMd>{type.label}</HeadingMd>

	{#if getImages(type.type).length > 0}
		<div class="grid grid-cols-2">
			{#each getImages(type.type) as image}
				<a href={`/match/${matchId}/media/${type.type}/upload/main/adjust`}>
					<img src={image.base64} alt={type.label} />
				</a>
			{/each}
		</div>
	{/if}
{:else}
	no images
{/each}

{#if uploads.length > 0}
	<HeadingMd>Uploads</HeadingMd>
	<div class="grid grid-cols-4">
		{#each images as image}
			<a href={`/match/${matchId}/media/${mediaType}/upload/${image.type}`}>
				<img src={image.base64} alt={image.type} />
			</a>
		{/each}
	</div>
{/if}

<ul role="list" class="grid grid-cols-4 gap-2">
	{#each PHOTO_LINKS as link}
		<MediaCard {link} image={images.find((image) => image.type === link.href)} />
	{/each}
</ul>
