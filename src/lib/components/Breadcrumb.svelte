<script lang="ts">
	let { breadcrumbs } = $props();
</script>

<nav class="flex" aria-label="Breadcrumb">
	<ol role="list" class="flex items-center space-x-2">
		{#each breadcrumbs as breadcrumb, i}
			{#if i === 0}
				<li>
					<div>
						<a href="/" class="text-slate-400 hover:text-slate-500">
							<svg
								class="size-5 shrink-0"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
								data-slot="icon"
							>
								<path
									fill-rule="evenodd"
									d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="sr-only">Home</span>
						</a>
					</div>
				</li>
			{:else}
				<li>
					<div class="flex items-center">
						<svg
							class="size-5 shrink-0 text-slate-300"
							fill="currentColor"
							viewBox="0 0 20 20"
							aria-hidden="true"
						>
							<path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
						</svg>
						{#if i === breadcrumbs.length - 1}
							<p class="ml-2 text-sm font-medium text-slate-700">{breadcrumb.name}</p>
						{:else}
							<a
								href={breadcrumb.href}
								class="ml-2 text-sm font-medium text-slate-500 hover:text-slate-700"
								aria-current="page">{breadcrumb.name}</a
							>
						{/if}
					</div>
				</li>
			{/if}
		{/each}
	</ol>
</nav>
