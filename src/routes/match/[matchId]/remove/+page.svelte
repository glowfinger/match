<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import { deleteMatch } from '$lib/database/MatchService';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import MatchCard from '$lib/components/cards/MatchCard.svelte';
	import type { LayoutProps } from '../$types';

	let props: LayoutProps = $props();
	let matchId = props.data.matchId;
	let matchTile = props.data.matchTile;
	let match = props.data.match;

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: matchTile, href: `/match/${matchId}` },
		{ name: 'Remove', href: `/match/${matchId}/remove` },
	];

	async function handleRemove() {
		deleteMatch(matchId);
		toast.success('Match removed');
		goto(`/`);
	}
</script>

{#if !match}
	<p>Match not found</p>
{:else}
	<Breadcrumb {breadcrumbs} />
	<HeadingLg>Remove match</HeadingLg>
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

	<Button type="button" onclick={handleRemove} variant="destructive">Remove</Button>
{/if}
