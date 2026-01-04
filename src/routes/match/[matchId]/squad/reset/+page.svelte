<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import type { Selection } from '$lib/database/IndexedDB';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import MatchCard from '$lib/components/cards/MatchCard.svelte';
	import { getSelections, resetSelections } from '$lib/database/SelectionDBService';
	import { onMount } from 'svelte';
	import CancelLink from '$lib/components/forms/CancelLink.svelte';
	import type { LayoutProps } from '../../$types';

	let props: LayoutProps = $props();
	let matchId = props.data.matchId;
	let matchTile = props.data.matchTile;
	let match = props.data.match;
	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: 'Manage squad', href: `/match/${matchId}/squad` },
		{ name: 'Reset', href: `/match/${matchId}/squad/reset` },
	];

	let selections: Selection[] = $state([]);

	onMount(async () => {
		selections = await getSelections(matchId);
	});

	async function handleConfirm() {
		resetSelections(matchId);
		toast.success('Squad reset');
		goto(`/match/${matchId}/squad`);
	}
</script>

{#if !match}
	<p>Match not found</p>
{:else}
	<Breadcrumb {breadcrumbs} />

	<MatchCard {match} />
	<div class="rounded-md bg-red-50 p-2">
		<div class="flex">
			<div class="m-2">
				<div class="mt-2 text-sm text-red-700">
					<ul role="list" class="list-disc space-y-1 pl-5">
						<li>This match will be removed permanantly</li>
					</ul>
				</div>
			</div>
		</div>
	</div>

	<Button type="button" onclick={handleConfirm} class="bg-red-500 text-red-100">Confirm</Button>
	<CancelLink href={`/match/${matchId}/squad`}>Back to squad</CancelLink>
{/if}
