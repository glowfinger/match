<script lang="ts">
	import { page } from '$app/state';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getPlayer } from '$lib/database/PlayerDBService';
	import type { Player, PlayerImage } from '$lib/database/IndexedDB';

	import { onMount } from 'svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import PhotoIcon from '$lib/components/icons/PhotoIcon.svelte';
	import HeadingMd from '$lib/components/typography/HeadingMd.svelte';

	const { key } = page.params;

	let player: Player | undefined = $state();

	let profileImage: PlayerImage | undefined = $state();

	let breadcrumbs = $state([
		{ name: 'Home', href: '/' },
		{ name: 'Players', href: '/players' },
		{ name: 'Profile', href: `/players/load/${key}` },
	]);

	onMount(async () => {
		player = await getPlayer(key);

		if (!player) {
			breadcrumbs = breadcrumbs.filter((b) => b.name !== 'Profile');
		} else {
			breadcrumbs[breadcrumbs.length - 1].name = `${player.bio.first} ${player.bio.last}`;
		}

		if (player?.images && player?.images.length > 0) {
			profileImage = player.images.find((image) => image.type === 'profile-front');
		}
	});
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Player Profile</HeadingLg>

{#if !player}
	<p>Player not found</p>
{/if}

{#if player}
	<div class="relative h-64 border border-slate-800 bg-slate-500 text-white">
		{#if profileImage}
			<div
				class="absolute bottom-0 left-4 aspect-square h-60 bg-cover bg-center"
				style="background-image: url('{profileImage.large}')"
			></div>
		{/if}

		<div class="absolute bottom-2 right-2 bg-slate-900/40 p-2">
			<h2 class="text-4xl font-bold">{player.bio.first} {player.bio.last}</h2>
			<p class="text-md font-bold text-yellow-600">{player.positions.main}</p>
		</div>
	</div>
{/if}

{#if player?.bio}
	<HeadingMd>Information</HeadingMd>
	<div class=" border-t border-slate-100">
		<dl class="divide-y divide-slate-100">
			<div class="grid grid-cols-3 gap-2 px-0 px-4 py-2">
				<dt class="text-sm/6 font-medium text-slate-900">Key</dt>
				<dd class="col-span-2 mt-0 mt-1 text-sm/6 text-slate-700">
					{player.key}
				</dd>
			</div>
			<div class="grid grid-cols-3 gap-2 px-0 px-4 py-2">
				<dt class="text-sm/6 font-medium text-slate-900">Name</dt>
				<dd class="col-span-2 mt-0 mt-1 text-sm/6 text-slate-700">
					{player.bio.first}
					{player.bio.last}
				</dd>
			</div>
			<div class="grid grid-cols-3 gap-2 px-0 px-4 py-2">
				<dt class="text-sm/6 font-medium text-slate-900">Screen name</dt>
				<dd class="col-span-2 mt-0 mt-1 text-sm/6 text-slate-700">
					{player.bio.screen}
				</dd>
			</div>
			<div class="grid grid-cols-3 gap-2 px-0 px-4 py-2">
				<dt class="text-sm/6 font-medium text-slate-900">Age</dt>
				<dd class="col-span-2 mt-0 mt-1 text-sm/6 text-slate-700">
					{player.bio.age}
				</dd>
			</div>
			<div class="grid grid-cols-3 gap-2 px-0 px-4 py-2">
				<dt class="text-sm/6 font-medium text-slate-900">Instagram</dt>
				<dd class="col-span-2 mt-0 mt-1 text-sm/6 text-slate-700">
					@{player.social?.instagram}
				</dd>
			</div>
			<div class="grid grid-cols-3 gap-2 px-0 px-4 py-2">
				<dt class="text-sm/6 font-medium text-slate-900">Instagram</dt>
				<dd class="col-span-2 mt-0 text-sm/6 text-slate-700">
					{#if player.tags?.homegrown}
						Yes
					{:else}
						No
					{/if}
				</dd>
			</div>
		</dl>
	</div>
{/if}

<HeadingMd>Positions</HeadingMd>

{#if player?.positions}
	<div class=" border-t border-slate-100">
		<dl class="divide-y divide-slate-100">
			<div class="grid grid-cols-3 gap-2 px-0 py-2">
				<dt class="text-sm/6 font-medium text-slate-900">Main</dt>
				<dd class="col-span-2 mt-0 text-sm/6 text-slate-700">
					{player.positions.main}
				</dd>
			</div>
			<div class="grid grid-cols-3 gap-2 px-0 py-2">
				<dt class="text-sm/6 font-medium text-slate-900">Others</dt>
				{#if player.positions.other.length > 0}
					<dd class="col-span-2 mt-0 text-sm/6 text-slate-700">
						{player.positions.other.filter((o) => o !== player?.positions.main).join(', ')}
					</dd>
				{:else}
					<dd class="col-span-2 mt-0 text-sm/6 text-slate-700">None</dd>
				{/if}
			</div>
		</dl>
	</div>
{/if}

<HeadingMd>Images</HeadingMd>
{#if player?.images && player?.images.length > 0}
	<ul
		role="list"
		class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
	>
		{#each player.images as image}
			<li class="relative">
				<div class="group overflow-hidden bg-slate-500">
					<img src={image.large} alt="" class="pointer-events-none aspect-square object-cover" />
				</div>
				<p class="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
					{image.type}
					{image.kit}
				</p>
				<p class="pointer-events-none block text-sm font-medium text-gray-500">{image.url}</p>
			</li>
		{/each}
	</ul>
{:else}
	<div class="text-center">
		<PhotoIcon class="mx-auto h-12 w-12 text-gray-400" />

		<h3 class="mt-2 text-sm font-semibold text-gray-900">No images</h3>
		<p class="mt-1 text-sm text-gray-500">Please contact meadia team.</p>
	</div>
{/if}
