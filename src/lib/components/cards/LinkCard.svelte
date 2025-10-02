<script lang="ts">
	import type { Component } from 'svelte';
	import EventIcon from '../icons/EventIcon.svelte';

	type Props = {
		link: { href: string; label: string; icon?: Component };
	};

	let { link }: Props = $props();
</script>

<li
	class="group aspect-square border border-slate-700 bg-white shadow-sm transition-colors duration-200 focus-within:outline-1 focus-within:outline-offset-2 focus-within:outline-slate-600 hover:border-slate-400 hover:bg-slate-100 dark:border-white/10 dark:bg-slate-800/50 dark:shadow-none dark:focus-within:outline-slate-500 dark:hover:border-white/25 dark:hover:bg-slate-700/50"
>
	<a
		href={link.href}
		class="flex h-full w-full flex-col items-center justify-center space-y-2 p-2 text-center"
	>
		{#if link.icon}
			<link.icon
				class="size-8 transition-colors duration-200 group-hover:text-slate-600 dark:group-hover:text-slate-400"
			/>
		{:else}
			<EventIcon
				class="size-8 transition-colors duration-200 group-hover:text-slate-600 dark:group-hover:text-slate-400"
			/>
		{/if}

		<p
			class="truncate text-sm font-bold text-slate-900 transition-colors duration-200 group-hover:text-slate-600 dark:text-white dark:group-hover:text-slate-400"
		>
			{link.label}
		</p>
	</a>
</li>
