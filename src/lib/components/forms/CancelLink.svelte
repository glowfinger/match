<script lang="ts">
	import { Button } from '../ui/button';

	type Props = {
		children: any;

		href: string;
	};
	let { children, href }: Props = $props();
</script>

<Button {href} class="bg-slate-100 text-sm font-semibold text-gray-900">{@render children()}</Button
>
