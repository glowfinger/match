<script lang="ts">
	import { SHIRT_NUMBERS } from '$lib/counts/PlayerCounts';
</script>

{#each [...SHIRT_NUMBERS] as [number, name]}
	<p>{number}: <a href="/match/1/lineup/position/{number}">{name}</a></p>
{/each}
