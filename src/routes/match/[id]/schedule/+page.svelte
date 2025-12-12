<script lang="ts">
	import { goto } from '$app/navigation';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import DateInput from '$lib/components/forms/DateInput.svelte';
	import TimeInput from '$lib/components/forms/TimeInput.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import { updateMatchSchedule } from '$lib/database/MatchService';
	import { matchScheduleSchema } from '$lib/validation/Schemas';
	import { getErrors, isValid } from '$lib/validation/Validator';
	import { toast } from 'svelte-sonner';
	import type { LayoutProps } from '../$types';
	import { Separator } from '$lib/components/ui/separator';
	import CancelLink from '$lib/components/forms/CancelLink.svelte';
	import SubmitButton from '$lib/components/forms/SubmitButton.svelte';

	let { data }: LayoutProps = $props();
	const { matchId, match, matchTile } = data;

	let formData = $state({ matchOn: '', meetAt: '', kickOffAt: '' });
	if (match.schedule !== undefined) {
		formData = { ...match.schedule };
	}
	let errors = $state({
		matchOn: '',
		meetAt: '',
		kickOffAt: '',
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!isValid(formData, matchScheduleSchema)) {
			errors = getErrors(formData, matchScheduleSchema);
			return;
		}

		await updateMatchSchedule(matchId, { ...formData });
		toast.success('Match schedule updated');
		goto(`/match/${matchId}`);
	}

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: matchTile, href: `/match/${matchId}` },
		{ name: 'Schedule', href: `/match/${matchId}/schedule` },
	];
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Match Schedule</HeadingLg>
<form onsubmit={handleSubmit} novalidate class="grid grid-cols-1 gap-2">
	<DateInput id="matchOn" label="Date" error={errors.matchOn} bind:value={formData.matchOn} />
	<TimeInput id="meetAt" label="Meet time" error={errors.meetAt} bind:value={formData.meetAt} />
	<TimeInput
		id="kickOfAt"
		label="Kick-off time"
		error={errors.kickOffAt}
		bind:value={formData.kickOffAt}
	/>
	<Separator />
	<CancelLink href={`/match/${matchId}`}>Back to match details</CancelLink>
	<SubmitButton>Save</SubmitButton>
</form>
