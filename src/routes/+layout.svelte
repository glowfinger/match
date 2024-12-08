<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="flex min-h-full justify-center">
	<div class=" w-full max-w-sm">
		{@render children()}
	</div>
</div>
