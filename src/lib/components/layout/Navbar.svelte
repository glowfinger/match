<script lang="ts">
	import { online } from 'svelte/reactivity/window';
	import OfflineIcon from '../icons/OfflineIcon.svelte';
	import OnlineIcon from '../icons/OnlineIcon.svelte';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	const session = authClient.useSession();
	async function signOut() {
		await authClient.signOut();
		goto('/sign-in');
	}
</script>

<nav class="bg-slate-900">
	<div class="mx-auto max-w-md px-4">
		<div class="relative flex h-16 items-center justify-between">
			<div class="absolute inset-y-0 flex items-center gap-4 sm:static sm:inset-auto">
				<a href="/">
					<img src="/favicon-96x96.png" alt="Club manager logo" class="size-8" />
				</a>
				<div class="relative rounded-full bg-slate-700 p-1">
					<span class="absolute -inset-1.5"></span>
					<span class="sr-only">View notifications</span>
					{#if online}
						<OnlineIcon />
					{:else}
						<OfflineIcon />
					{/if}
				</div>
				{#if $session.data !== null}
					<button class="text-slate-100" onclick={signOut}>Sign out</button>
				{/if}
			</div>
		</div>
	</div>
</nav>
