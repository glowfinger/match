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
	<label for={id} class="block text-sm/6 font-medium text-gray-900">{label}</label>
	<div class="mt-2 grid grid-cols-1">
		<input
			type="time"
			name={id}
			{id}
			class="col-start-1 row-start-1 block w-full bg-white py-1.5 pl-3 pr-10 text-base text-red-900 outline outline-1 -outline-offset-1 outline-red-300 placeholder:text-red-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-red-600 sm:pr-9 sm:text-sm/6"
			bind:value
		/>
		{#if error}
			<ErrorIcon
				class="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-red-500 sm:size-4"
			/>
		{/if}
	</div>
	<ErrorLabel>{error}</ErrorLabel>
</div>
