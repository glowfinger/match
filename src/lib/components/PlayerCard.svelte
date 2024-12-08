<script lang="ts">
	import type { Player } from '$lib/IndexedDB';

	type Props = {
		player: Player;
	};

	let { player }: Props = $props();
</script>

<div class="card">
	<header class="card-header">{player.bio.first} {player.bio.last}</header>
	<section class="p-4">(content)</section>
	<footer class="card-footer">
		<a class="anchor" href={`/players/profile/${player.key}`}>View</a>
	</footer>
</div>
