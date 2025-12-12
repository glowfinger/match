<script lang="ts">
	import type { Player } from '$lib/database/IndexedDB';

	type Props = {
		player: Player;
	};

	let { player }: Props = $props();
</script>

<div class="duration-00 aspect-square rounded-md border border-slate-500 bg-white shadow-sm">
	<h2>{player.bio.first} {player.bio.last}</h2>
	<p>{player.key}</p>
	<a href={`/players/profile/${player.key}`} class=""> View profile </a>
</div>
