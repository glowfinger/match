<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	type Props = {
		children: any;
		disabled?: boolean;
	};
	let { children, disabled }: Props = $props();
</script>

<Button
	type="submit"
	class="rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-slate-500 focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-slate-600"
	{disabled}>{@render children()}</Button
>
