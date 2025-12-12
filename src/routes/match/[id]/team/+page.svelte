<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import type { MatchTeam } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { getErrors, isValid } from '$lib/validation/Validator';
	import { matchTeamSchema } from '$lib/validation/Schemas';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import SubmitButton from '$lib/components/forms/SubmitButton.svelte';
	import CancelLink from '$lib/components/forms/CancelLink.svelte';
	import TextInput from '$lib/components/forms/TextInput.svelte';
	import type { LayoutProps } from '../$types';
	import { updateMatchTeam } from '$lib/database/MatchService';

	let { data }: LayoutProps = $props();
	const { matchId, match, matchTile } = data;

	// TODO: This should be from constants or ENV
	let teamData = $state<MatchTeam>({
		key: 'chipstead',
		club: 'Chipstead',
		squad: '',
		badge: 'https://glowfinger.blob.core.windows.net/chipstead/teams/chipstead.png',
	});
	let errors = $state({ club: '', squad: '' });

	onMount(async () => {
		if (match?.team !== undefined) {
			teamData = { ...match.team };
		}
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: matchTile, href: `/match/${matchId}` },
		{ name: 'Team', href: `/match/${matchId}/team` },
	];

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!isValid(teamData, matchTeamSchema)) {
			errors = getErrors(teamData, matchTeamSchema);
			return;
		}

		await updateMatchTeam(matchId, { ...teamData });
		toast.success('Team updated');
		goto(`/match/${matchId}`);
	}
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Team</HeadingLg>
<form onsubmit={handleSubmit} novalidate class="grid grid-cols-1 gap-2">
	<TextInput
		id="match-team-club"
		bind:value={teamData.club}
		title="Club"
		placeholder="Enter club name"
		error={errors.club}
		disabled
	/>
	<TextInput
		id="match-team-squad"
		bind:value={teamData.squad}
		title="Squad"
		placeholder="Enter squad name"
		error={errors.squad}
	/>
	<Separator />
	<CancelLink href={`/match/${matchId}`}>Back to match details</CancelLink>
	<SubmitButton>Save</SubmitButton>
</form>
