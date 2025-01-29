<script lang="ts">
	type Props = {
		title: string;
		value: string | number;
		active: boolean;
	};

	let { title, value, active }: Props = $props();
</script>

{#if active}
	<div class="overflow-hidden rounded-sm border border-slate-400 bg-slate-400 p-2 shadow">
		<dt class="truncate text-sm font-medium text-white">{title}</dt>
		<dd class="text-3xl font-semibold tracking-tight text-white">{value}</dd>
	</div>
{:else}
	<div class="overflow-hidden rounded-sm border border-slate-400 bg-white p-2 shadow">
		<dt class="truncate text-sm font-medium text-slate-500">{title}</dt>
		<dd class="text-3xl font-semibold tracking-tight text-slate-900">{value}</dd>
	</div>
{/if}
