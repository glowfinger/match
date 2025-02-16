<script lang="ts">
	import PersonIcon from '$lib/components/icons/PersonIcon.svelte';
	import type { Player } from '$lib/database/IndexedDB';
	type Props = {
		player: Player | undefined | null;
	};

	let { player }: Props = $props();

	function getAvatarLabel(player: Player) {
		return player.bio.first[0] + player.bio.last[0];
	}

	function getPlayerImage(player: Player) {
		const image = player.images.find(
			(image) => image.type === 'profile-front' && image.kit === 'home',
		);

		if (image) {
			return `https://glowfinger.blob.core.windows.net/smg/thumbnails-260x260/${image.url}.png`;
		}

		return `https://glowfinger.blob.core.windows.net/smg/thumbnails-260x260/${player.images[0].url}.png`;
	}
</script>

<div class="shrink-0">
	<span class="inline-flex size-10 items-center justify-center rounded-full bg-slate-500">
		<span class="font-bold text-white">{1}</span>
	</span>
</div>

{#if player && player.images?.length > 0}
	<div class="shrink-0">
		<img
			class="size-10"
			src={`https://glowfinger.blob.core.windows.net/smg/thumbnails-260x260/${player.images[0].url}.png`}
			alt=""
		/>
	</div>
{:else if player}
	<span class="inline-flex size-10 items-center justify-center bg-slate-100 ring-1 ring-slate-400">
		<span class="font-medium text-slate-800">{getAvatarLabel(player)}</span>
	</span>
{:else}
	<span class="inline-flex size-10 items-center justify-center bg-slate-100 ring-1 ring-slate-200">
		<span class="font-medium text-slate-500"><PersonIcon class="size-8"></PersonIcon></span>
	</span>
{/if}
