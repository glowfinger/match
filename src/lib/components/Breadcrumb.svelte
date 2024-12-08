<script lang="ts">
	let { breadcrumbs } = $props();
</script>

<ol class="breadcrumb">
	{#each breadcrumbs as breadcrumb, i}
		{#if i === breadcrumbs.length - 1}
			<li>{breadcrumb.name}</li>
		{:else}
			<a class="anchor" href={breadcrumb.href}>{breadcrumb.name}</a>
			<li class="crumb-separator" aria-hidden="true">/</li>
		{/if}
	{/each}
</ol>
