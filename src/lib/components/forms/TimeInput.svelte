<script lang="ts">
	import ErrorIcon from '../icons/ErrorIcon.svelte';
	import ErrorLabel from './ErrorLabel.svelte';

	type Props = {
		id: string;
		value: string;
		label: string;
		error?: string;
		disabled?: boolean;
	};
	let { id, value = $bindable(), label, error, disabled }: Props = $props();
</script>

<div>
	{#if error}
		<label for="email" class="block text-sm/6 font-medium text-red-700">{label}</label>
	{:else}
		<label for="email" class="block text-sm/6 font-medium text-gray-900">{label}</label>
	{/if}

	<div class="mt-2 grid grid-cols-1">
		{#if error}
			<input
				type="time"
				name={id}
				{id}
				class="block w-full rounded bg-red-50 px-3 py-1.5 text-base text-red-900 outline outline-1 -outline-offset-1 outline-red-300 placeholder:text-red-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-red-600 sm:text-sm/6"
				bind:value
				{disabled}
			/>
		{:else}
			<input
				type="time"
				name={id}
				{id}
				class="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
				bind:value
				{disabled}
			/>
		{/if}
	</div>
	<ErrorLabel>{error}</ErrorLabel>
</div>
