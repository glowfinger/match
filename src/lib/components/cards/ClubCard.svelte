<script lang="ts">
	import type { Club } from '$lib/database/IndexedDB';

	type Props = {
		club: Club;
	};
	let { club }: Props = $props();
</script>

<div
	class="relative flex items-center space-x-3 border border-gray-300 bg-white p-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
>
	<div class="shrink-0">
		<img class="size-10" src={club.badge} alt="" />
	</div>
	<div class="min-w-0 flex-1">
		<a href="#" class="focus:outline-none">
			<span class="absolute inset-0" aria-hidden="true"></span>
			<p class="text-sm font-medium text-gray-900">{club.name}</p>
		</a>
	</div>
</div>
