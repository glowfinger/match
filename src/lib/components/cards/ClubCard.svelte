<script lang="ts">
	import type { Club } from '$lib/database/IndexedDB';

	type Props = {
		club: Club;
	};
	let { club }: Props = $props();
</script>

<div class="group relative aspect-[5/7] overflow-hidden border border-slate-600 bg-white">
	<div class=" perspective-distant absolute inset-0 flex items-center justify-center">
		<img
			class="  group-hover:translate-z-8 group-hover:rotate-x-50 group-hover:rotate-z-45 h-full object-cover transition duration-300 ease-in-out group-hover:scale-150"
			src={club.badge}
			alt=""
		/>
	</div>

	<div
		class="duration-400 absolute inset-0 flex items-center justify-center transition ease-in-out group-hover:bg-slate-900/50 group-hover:backdrop-blur-sm"
	>
		<h2 class="w-full bg-slate-700/60 text-center text-lg font-bold text-white">{club.name}</h2>
	</div>
</div>
