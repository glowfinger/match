<script lang="ts">
	type Props = {
		title: string;
		disabled?: boolean;
	};
	let { title, disabled }: Props = $props();
</script>

<button type="submit" class="variant-filled btn rounded-none" {disabled}>{title}</button>
