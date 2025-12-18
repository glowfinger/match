<script lang="ts">
	import { goto } from '$app/navigation';
	import ErrorLabel from '$lib/components/forms/ErrorLabel.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { MatchResult } from '$lib/database/IndexedDB';
	import { updateMatchResult } from '$lib/database/MatchService';
	import { matchResultSchema } from '$lib/validation/Schemas';
	import { getErrors, isValid } from '$lib/validation/Validator';
	import { toast } from 'svelte-sonner';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import type { LayoutProps } from '../$types';
	import CancelLink from '$lib/components/forms/CancelLink.svelte';
	import SubmitButton from '$lib/components/forms/SubmitButton.svelte';

	let { data }: LayoutProps = $props();
	const { matchId, match, matchTile } = data;

	let formData: MatchResult = $state({
		homeScore: 0,
		awayScore: 0,
	});

	if (match.result !== undefined) {
		formData = { ...match.result };
	}

	let errors = $state({
		homeScore: '',
		awayScore: '',
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!isValid(formData, matchResultSchema)) {
			errors = getErrors(formData, matchResultSchema);
			return;
		}

		updateMatchResult(matchId, { ...formData });
		toast.success('Match result updated');
		goto(`/match/${matchId}`);
	}

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: matchTile, href: `/match/${matchId}` },
		{ name: 'Result', href: `/match/${matchId}/result` },
	];
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Result</HeadingLg>
{#if !match}
	<p>Match not found</p>
{:else}
	<form onsubmit={handleSubmit} novalidate>
		<div class="mt-2 grid grid-cols-1 gap-4">
			<div class="grid w-full items-center gap-1.5">
				<Label for="match-type">Home Score</Label>

				<Input
					type="number"
					id="match-type"
					bind:value={formData.homeScore}
					min={0}
					max={999}
					step={1}
				/>
				<ErrorLabel>{errors.homeScore}</ErrorLabel>
			</div>

			<div class="grid w-full gap-1.5">
				<Label for="match-address">Away Score</Label>
				<Input
					type="number"
					id="match-address"
					bind:value={formData.awayScore}
					min={0}
					max={999}
					step={1}
				/>
				<ErrorLabel>{errors.awayScore}</ErrorLabel>
			</div>
			<Separator />
			<CancelLink href={`/match/${matchId}`}>Back to match details</CancelLink>
			<SubmitButton>Save</SubmitButton>
		</div>
	</form>
{/if}
