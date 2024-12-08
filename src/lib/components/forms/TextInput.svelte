<script lang="ts">
	type Props = {
		value: string;
		title: string;
		error?: string;
		disabled?: boolean;
	};

	let { value = $bindable(''), title, error, disabled }: Props = $props();
</script>

<label class="label">
	<span>{title}</span>
	<input
		class="input rounded-none"
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
