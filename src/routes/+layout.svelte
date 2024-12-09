<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="flex min-h-full justify-center">
	<div class=" w-full max-w-sm px-2">
		{@render children()}
	</div>
</div>
