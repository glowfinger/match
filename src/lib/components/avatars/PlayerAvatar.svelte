<script lang="ts">
	import type { Player, PlayerImage } from '$lib/IndexedDB';

	type Props = {
		player: Player;
	};
	let { player }: Props = $props();

	// let avatarUrl = getAvatarUrl(player.images);
	let avatarLabel = getAvatarLabel(player);

	function getAvatarUrl(images: PlayerImage[]) {
		const image = images.find((image) => image.type === 'profile-front' && image.kit === 'home');

		if (image) {
			return `https://glowfinger.blob.core.windows.net/smg/thumbnails-260x260/${image.url}.png`;
		}

		return `https://glowfinger.blob.core.windows.net/smg/thumbnails-260x260/${player.images[0].url}.png`;
	}

	function getAvatarLabel(player: Player) {
		return player.bio.first[0] + player.bio.last[0];
	}
</script>

<span
	class="inline-flex size-10 items-center justify-center rounded-full bg-slate-100 ring-1 ring-slate-400"
>
	<span class="font-medium text-slate-800">{avatarLabel}</span>
</span>
