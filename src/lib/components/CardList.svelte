<script lang="ts">
	type Props = {
		children?: any;
	};

	let { children }: Props = $props();
</script>

<ul role="list" class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
	{@render children()}
</ul>
