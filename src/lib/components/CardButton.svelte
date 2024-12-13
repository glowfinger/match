<script lang="ts">
	type Props = {
		children?: any;
		onClick: () => void | Promise<void>;
		active?: boolean;
	};

	let { onClick, children, active = false }: Props = $props();
</script>

{#if active}
	<div class="flex w-0 flex-1">
		<button
			onclick={onClick}
			class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 border border-transparent bg-slate-500 py-2 text-sm font-semibold text-slate-100"
		>
			{@render children()}
		</button>
	</div>
{:else}
	<div class="flex w-0 flex-1">
		<button
			onclick={onClick}
			class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 border border-transparent py-2 text-sm font-semibold text-slate-900"
		>
			{@render children()}
		</button>
	</div>
{/if}
