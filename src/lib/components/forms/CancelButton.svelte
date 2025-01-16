<script lang="ts">
	type Props = {
		children: any;
		disabled?: boolean;
		onclick: () => void;
	};
	let { children, disabled, onclick }: Props = $props();
</script>

<button type="button" class="text-sm/6 font-semibold text-gray-900" {disabled} {onclick}
	>{@render children()}</button
>
