<script lang="ts">
	let { children } = $props();
</script>

<h1 class="text-2xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">
	{#if children}
		{@render children?.()}
	{:else}
		Enter heading
	{/if}
</h1>
