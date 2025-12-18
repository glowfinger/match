<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import ErrorLabel from './ErrorLabel.svelte';

	type Props = {
		id: string;
		value: string;
		title: string;
		error?: string;
		disabled?: boolean;
		options: { value: string; label: string }[];
	};
	let { id, value = $bindable(), title, options = [], error, disabled }: Props = $props();

	const selectedLabel = $derived(
		value ? options.find((option) => option.value === value)?.label : 'Select an option',
	);
</script>

<div class="grid w-full items-center gap-1.5">
	<Label for={id}>{title}</Label>
	<Select.Root type="single" bind:value>
		<Select.Trigger class="w-full bg-slate-50" {disabled}>
			{selectedLabel}
		</Select.Trigger>
		<Select.Content class="bg-slate-50">
			{#each options as option}
				<Select.Item value={option.value}>{option.label}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>

	<ErrorLabel>{error}</ErrorLabel>
</div>
