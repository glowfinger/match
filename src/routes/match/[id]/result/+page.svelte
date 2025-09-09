<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import ErrorLabel from '$lib/components/forms/ErrorLabel.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { Match, MatchResult } from '$lib/database/IndexedDB';
	import { getMatch, updateMatchResult } from '$lib/database/MatchService';
	import { matchResultSchema } from '$lib/validation/Schemas';
	import { getErrors, isValid } from '$lib/validation/Validator';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let match: Match | undefined = $state();
	const matchId = Number.parseInt(page.params.id as string);

	let data: MatchResult = $state({
		homeScore: 0,
		awayScore: 0,
	});

	let errors = $state({
		homeScore: '',
		awayScore: '',
	});

	onMount(async () => {
		match = await getMatch(matchId);
		if (match.result !== undefined) {
			data = { ...match.result };
		}
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!isValid(data, matchResultSchema)) {
			errors = getErrors(data, matchResultSchema);
			return;
		}

		updateMatchResult(matchId, { ...data });
		toast.success('Match result updated');
		goto(`/match/${matchId}`);
	}

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
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
					bind:value={data.homeScore}
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
					bind:value={data.awayScore}
					min={0}
					max={999}
					step={1}
				/>
				<ErrorLabel>{errors.awayScore}</ErrorLabel>
			</div>
			<Separator />
			<Button href={`/match/${matchId}`} variant="outline">Cancel</Button>
			<Button type="submit">Save</Button>
		</div>
	</form>
{/if}
