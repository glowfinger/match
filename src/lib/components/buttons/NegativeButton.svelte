<script lang="ts">
	type Props = {
		children?: any;
		onClick: () => void | Promise<void>;
		active?: boolean;
	};

	let { onClick, children, active = false }: Props = $props();
</script>

{#if active}
	<button
		onclick={onClick}
		class="relative -mr-px inline-flex w-full flex-1 items-center justify-center gap-x-3 border border-transparent bg-red-500 py-2 text-sm font-semibold text-red-100"
	>
		{@render children()}
	</button>
{:else}
	<button
		onclick={onClick}
		class="relative -mr-px inline-flex w-full flex-1 items-center justify-center gap-x-3 border border-transparent bg-red-300 py-2 text-sm font-semibold text-red-900"
	>
		{@render children()}
	</button>
{/if}
