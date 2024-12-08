<script lang="ts">
	import type { Match } from '$lib/IndexedDB';

	type Props = {
		match: Match;
	};

	let { match }: Props = $props();
</script>

<div class="card">
	<header class="card-header">{match.matchOn}</header>
	<section class="p-4">(content)</section>
	<footer class="card-footer">
		<a class="anchor" href={`/match/${match.id}`}>View</a>
	</footer>
</div>
