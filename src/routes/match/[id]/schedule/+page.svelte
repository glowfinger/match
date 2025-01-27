<script lang="ts">
	import { goto } from '$app/navigation';

	import { page } from '$app/state';
	import DateInput from '$lib/components/forms/DateInput.svelte';
	import TimeInput from '$lib/components/forms/TimeInput.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Match } from '$lib/database/IndexedDB';
	import { getMatch, updateMatchSchedule } from '$lib/database/MatchService';
	import { matchScheduleSchema } from '$lib/validation/Schemas';
	import { getErrors, isValid } from '$lib/validation/Validator';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	const matchId = Number.parseInt(page.params.id);

	let match: Match | undefined = $state();

	let data = $state({ matchOn: '', meetAt: '', kickOffAt: '' });

	let errors = $state({
		matchOn: '',
		meetAt: '',
		kickOffAt: '',
	});

	onMount(async () => {
		// fetch match scheduls
		match = await getMatch(matchId);
		if (match?.schedule) {
			data.matchOn = match.schedule.matchOn;
			data.meetAt = match.schedule.meetAt;
			data.kickOffAt = match.schedule.kickOffAt;
		}
	});
	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!isValid(data, matchScheduleSchema)) {
			errors = getErrors(data, matchScheduleSchema);
			return;
		}

		if (match) {
			match.schedule = {
				matchOn: data.matchOn,
				meetAt: data.meetAt,
				kickOffAt: data.kickOffAt,
			};

			await updateMatchSchedule(matchId, { ...match.schedule });
		}
		toast.success('Match schedule updated');
		goto(`/match/${matchId}`);
	}
</script>

<form onsubmit={handleSubmit} novalidate>
	<div class="mt-2 grid grid-cols-1 gap-4">
		<HeadingLg>Match Schedule</HeadingLg>
		<DateInput id="matchOn" label="Date" error={errors.matchOn} bind:value={data.matchOn} />
		<TimeInput id="meetAt" label="Meet time" error={errors.meetAt} bind:value={data.meetAt} />
		<TimeInput
			id="kickOfAt"
			label="Kick-off time"
			error={errors.kickOffAt}
			bind:value={data.kickOffAt}
		/>

		<div class="mt-6 flex items-center justify-end gap-x-6">
			<Button href={`/match/${matchId}`} variant="outline">Cancel</Button>
			<Button type="submit">Save</Button>
		</div>
	</div>
</form>
