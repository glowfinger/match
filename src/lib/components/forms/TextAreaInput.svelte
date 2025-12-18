<script lang="ts">
	type Props = {
		id: string;
		value: string;
		title: string;
		placeholder?: string;
		error?: string;
		disabled?: boolean;
		rows?: number;
	};

	let {
		id,
		value = $bindable(''),
		title,
		placeholder,
		error,
		disabled,
		rows = 4,
	}: Props = $props();
</script>

<label class="label">
	<span>{title}</span>
	<textarea
		class="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-sm border bg-slate-50 px-3 py-2 text-base shadow-xs transition-colors focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
		{id}
		{title}
		{placeholder}
		bind:value
		{disabled}
		{rows}
	></textarea>
	{#if error}
		<p class="text-red-500">{error}</p>
	{/if}
</label>
