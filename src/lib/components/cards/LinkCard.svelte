<script lang="ts">
	import type { Component } from 'svelte';
	import EventIcon from '../icons/EventIcon.svelte';

	type Props = {
		link: { href: string; label: string; icon?: Component };
	};

	let { link }: Props = $props();
</script>

<li
	class="aspect-square border border-slate-700 bg-white shadow-sm focus-within:outline-1 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:border-gray-400 dark:border-white/10 dark:bg-gray-800/50 dark:shadow-none dark:focus-within:outline-indigo-500 dark:hover:border-white/25"
>
	<a
		href={link.href}
		class="flex h-full w-full flex-col items-center justify-center space-y-2 p-2 text-center"
	>
		{#if link.icon}
			<link.icon class="size-8" />
		{:else}
			<EventIcon class="size-8" />
		{/if}

		<p class="text-sm font-medium overflow-ellipsis text-gray-900 dark:text-white">{link.label}</p>
	</a>
</li>
