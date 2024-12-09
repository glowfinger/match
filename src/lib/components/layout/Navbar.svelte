<script lang="ts">
	import { network } from '$lib/stores/NetworkStore.svelte';
	import OfflineIcon from '../icons/OfflineIcon.svelte';
	import OnlineIcon from '../icons/OnlineIcon.svelte';
</script>

<nav class="bg-slate-800">
	<div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
		<div class="relative flex h-16 items-center justify-between">
			<div
				class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
			>
				<div class="relative rounded-full bg-slate-700 p-1">
					<span class="absolute -inset-1.5"></span>
					<span class="sr-only">View notifications</span>

					{#if network.online}
						<OnlineIcon />
					{:else}
						<OfflineIcon />
					{/if}
				</div>

				<!-- Profile dropdown -->
			</div>
		</div>
	</div>
</nav>
