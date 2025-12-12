<script lang="ts">
	import ErrorLabel from './ErrorLabel.svelte';

	type Props = {
		id: string;
		value: string;
		label: string;
		error?: string;
		disabled?: boolean;
		step?: number;
	};
	let { id, value = $bindable(), label, error, disabled, step = 300 }: Props = $props();
</script>

<div>
	{#if error}
		<label for="email" class="block text-sm/6 font-medium text-red-700">{label}</label>
	{:else}
		<label for="email" class="block text-sm/6 font-medium text-gray-900">{label}</label>
	{/if}

	<div class="mt-2 grid grid-cols-1">
		<input
			type="time"
			name={id}
			{id}
			{step}
			class="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-sm border bg-slate-50 px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
			bind:value
			{disabled}
		/>
	</div>
	<ErrorLabel>{error}</ErrorLabel>
</div>
