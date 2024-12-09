<script lang="ts">
	type Props = {
		children?: any;
	};

	let { children }: Props = $props();
</script>

<ul role="list" class="grid grid-cols-1 gap-2">
	{@render children()}
</ul>
