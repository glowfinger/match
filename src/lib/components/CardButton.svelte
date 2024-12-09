<script lang="ts">
	type Props = {
		children?: any;
		onClick: () => void | Promise<void>;
	};

	let { onClick, children }: Props = $props();
</script>

<div class="flex w-0 flex-1">
	<button
		onclick={onClick}
		class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-2 text-sm font-semibold text-slate-900"
	>
		{@render children()}
	</button>
</div>
