<script lang="ts">
	let { children } = $props();
</script>

<p class="mt-2 text-sm text-red-600" id="email-error">
	{@render children()}
</p>
