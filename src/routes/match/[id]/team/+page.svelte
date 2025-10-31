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
	import SubmitButton from '$lib/components/forms/SubmitButton.svelte';
	import CancelLink from '$lib/components/forms/CancelLink.svelte';
	import TextInput from '$lib/components/forms/TextInput.svelte';

	const matchId = Number.parseInt(page.params.id as string);
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
		toast.success('Team updated');
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
			<div class="grid w-full items-center gap-1.5">
				<TextInput
					id="match-team-club"
					value={data.club}
					title="Club"
					error={errors.club}
					disabled
				/>
			</div>

			<div class="grid w-full items-center gap-1.5">
				<TextInput id="match-team-squad" value={data.squad} title="Squad" error={errors.squad} />
			</div>

			<Separator />

			<CancelLink href={`/match/${matchId}`}>Cancel</CancelLink>
			<SubmitButton>Save</SubmitButton>
		{/if}
	</div>
</form>
