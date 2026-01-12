<script lang="ts">
	import '../../app.css';
	let { children } = $props();
</script>

<div class="flex min-h-full justify-center">
	<div class="w-full max-w-md min-w-xs p-4">
		<div class="grid grid-cols-1 gap-2">
			{@render children()}
		</div>
	</div>
</div>
