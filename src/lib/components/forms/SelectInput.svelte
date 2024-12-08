<script lang="ts">
	type Props = {
		value: string;
		title: string;
		error?: string;
		disabled?: boolean;
		options: { value: string; label: string }[];
	};
	let { value = $bindable(), title, options = [], error, disabled }: Props = $props();
</script>

<label class="label">
	<span>{title}</span>
	<select class="select rounded-none" bind:value {disabled}>
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
	{#if error}
		<p class="text-red-500">{error}</p>
	{/if}
</label>
