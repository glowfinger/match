<script lang="ts">
	import type { Club } from '$lib/database/IndexedDB';

	type Props = {
		club: Club;
	};
	let { club }: Props = $props();
</script>

<div class="group relative aspect-5/7 overflow-hidden border border-slate-600 bg-white">
	<div class=" absolute inset-0 flex items-center justify-center perspective-distant">
		<img
			class="  h-full object-cover transition duration-300 ease-in-out group-hover:translate-z-8 group-hover:scale-150 group-hover:rotate-x-10 group-hover:rotate-z-10"
			src={club.badge}
			alt=""
		/>
	</div>

	<div
		class="absolute inset-0 flex items-center justify-center transition duration-400 ease-in-out group-hover:bg-slate-900/50 group-hover:backdrop-blur-xs"
	>
		<h2 class="w-full bg-slate-700/60 text-center text-lg font-bold text-white">{club.name}</h2>
	</div>
</div>
