<script lang="ts">
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import { network } from '$lib/stores/NetworkStore.svelte';
	import '../app.css';

	let { children } = $props();

	function handleOnline() {
		network.online = true;
	}

	function handleOffline() {
		network.online = false;
	}
</script>

<svelte:window ononline={handleOnline} onoffline={handleOffline} />

<Navbar />
<div class="flex min-h-full justify-center">
	<div class=" w-full max-w-sm px-2">
		{@render children()}
	</div>
</div>
