<script lang="ts">
	type Props = {
		title: string;
		value: string | number;
	};

	let { title, value }: Props = $props();
</script>

<div class="overflow-hidden rounded-sm border border-slate-400 bg-white p-2 shadow">
	<dt class="truncate text-sm font-medium text-slate-500">{title}</dt>
	<dd class="text-3xl font-semibold tracking-tight text-slate-900">{value}</dd>
</div>
