<script lang="ts">
	type Props = {
		children: any;
		disabled?: boolean;
	};
	let { children, disabled }: Props = $props();
</script>

<button
	type="submit"
	class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
	{disabled}>{@render children()}</button
>
