<script lang="ts">
	import type { MatchImage } from '$lib/database/IndexedDB';
	import AddPhotoAlternativeIcon from '../icons/AddPhotoAlternativeIcon.svelte';
	import PhotoIcon from '../icons/PhotoIcon.svelte';

	type Props = {
		link: { href: string; label: string };
		image?: MatchImage;
	};

	let { link, image }: Props = $props();
</script>

{#if image}
	<li
		style="background-image: url({image.base64});"
		class="group aspect-4/5 border border-slate-700 bg-white bg-cover bg-center shadow-sm transition-colors duration-200 focus-within:outline-1 focus-within:outline-offset-2 focus-within:outline-slate-600 hover:border-slate-400 hover:bg-slate-100 dark:border-white/10 dark:bg-slate-800/50 dark:shadow-none dark:focus-within:outline-slate-500 dark:hover:border-white/25"
	>
		<a
			href={link.href}
			class=" float-left flex h-full w-full flex-col items-center justify-center space-y-2 p-2 text-center"
		>
			<PhotoIcon
				class="size-8 transition-colors duration-200 group-hover:text-slate-600 dark:group-hover:text-slate-400"
			/>
			<p
				class="truncate text-sm font-bold text-slate-900 transition-colors duration-200 group-hover:text-slate-600 dark:text-white dark:group-hover:text-slate-400"
			>
				{link.label}
			</p>
		</a>
	</li>
{:else}
	<li
		class="group aspect-4/5 border border-slate-700 bg-white shadow-sm transition-colors duration-200 focus-within:outline-1 focus-within:outline-offset-2 focus-within:outline-slate-600 hover:border-slate-400 hover:bg-slate-100 dark:border-white/10 dark:bg-slate-800/50 dark:shadow-none dark:focus-within:outline-slate-500 dark:hover:border-white/25 dark:hover:bg-slate-700/50"
	>
		<a
			href={link.href}
			class="flex h-full w-full flex-col items-center justify-center space-y-2 p-2 text-center"
		>
			<AddPhotoAlternativeIcon
				class="size-8 transition-colors duration-200 group-hover:text-slate-600 dark:group-hover:text-slate-400"
			/>

			<p
				class="truncate text-sm font-bold text-slate-900 transition-colors duration-200 group-hover:text-slate-600 dark:text-white dark:group-hover:text-slate-400"
			>
				{link.label}
			</p>
		</a>
	</li>
{/if}
