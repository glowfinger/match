<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getMatch, updateMatchTeam } from '$lib/database/MatchService';

	import type { Match, MatchTeam } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Label } from '$lib/components/ui/label';
	import ErrorLabel from '$lib/components/forms/ErrorLabel.svelte';
	import { getErrors, isValid } from '$lib/validation/Validator';
	import { matchTeamSchema } from '$lib/validation/Schemas';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	const matchId = Number.parseInt(page.params.id);
	let match: Match | undefined = $state();

	// TODO: This should be from constants or ENV
	let data = $state<MatchTeam>({
		key: 'chipstead',
		club: 'Chipstead',
		squad: '',
		badge: 'https://glowfinger.blob.core.windows.net/chipstead/teams/chipstead.png',
	});
	let errors = $state({ club: '', squad: '' });

	onMount(async () => {
		match = await getMatch(matchId);

		if (match?.team !== undefined) {
			data = { ...match.team };
		}
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: 'Team', href: `/match/${matchId}/team` },
	];

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!isValid(data, matchTeamSchema)) {
			errors = getErrors(data, matchTeamSchema);
			return;
		}

		await updateMatchTeam(matchId, { ...data });
		toast.success('Opponent updated');
		goto(`/match/${matchId}`);
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Team</HeadingLg>
<form onsubmit={handleSubmit} novalidate>
	<div class="mt-4 grid grid-cols-1 gap-2">
		{#if !match}
			<p>Match not found</p>
		{:else}
			<div class="grid w-full max-w-sm items-center gap-1.5">
				<Label for="match-type">Club</Label>

				<Input type="text" id="match-type" bind:value={data.club} disabled />
				<ErrorLabel>{errors.club}</ErrorLabel>
			</div>

			<div class="grid w-full max-w-sm items-center gap-1.5">
				<Label for="match-type">Squad</Label>

				<Input type="text" id="match-type" bind:value={data.squad} />
				<ErrorLabel>{errors.squad}</ErrorLabel>
			</div>

			<Separator />

			<Button href={`/match/${matchId}`} variant="outline">Cancel</Button>
			<Button type="submit">Save</Button>
		{/if}
	</div>
</form>
