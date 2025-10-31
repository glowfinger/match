<script lang="ts">
	type Props = {
		id: string;
		value: string;
		title: string;
		error?: string;
		disabled?: boolean;
	};

	let { id, value = $bindable(''), title, error, disabled }: Props = $props();
</script>

<label class="label">
	<span>{title}</span>
	<input
		class=" border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-sm border bg-slate-50 px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
		{id}
		{title}
		type="text"
		placeholder="input text"
		bind:value
		{disabled}
	/>
	{#if error}
		<p class="text-red-500">{error}</p>
	{/if}
</label>
