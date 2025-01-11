<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import ErrorLabel from '$lib/components/forms/ErrorLabel.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Select from '$lib/components/ui/select';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { Match, MatchDetail } from '$lib/database/IndexedDB';
	import { getMatch } from '$lib/database/MatchService';
	import { matchDetailSchema, matchScheduleSchema } from '$lib/validation/Schemas';
	import { getErrors, isValid } from '$lib/validation/Validator';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	let match: Match | undefined = $state();
	const matchId = Number.parseInt(page.params.id);

	let data: MatchDetail = $state({
		venue: '',
		type: '',
		address: '',
	});

	let errors = $state({
		venue: '',
		type: '',
		address: '',
	});

	onMount(async () => {
		match = await getMatch(matchId);
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!isValid(data, matchDetailSchema)) {
			errors = getErrors(data, matchDetailSchema);
			console.log(errors);
			return;
		}

		toast.success('Match details updated');
		goto(`/match/${matchId}`);
	}

	const venues = [
		{ value: 'HOME', label: 'Home' },
		{ value: 'AWAY', label: 'Away' },
		{ value: 'NEUTRAL', label: 'Neutral' },
	];
</script>

<form onsubmit={handleSubmit} novalidate>
	<div class="mt-2 grid grid-cols-1 gap-4">
		<HeadingLg>Details</HeadingLg>
		<div class="grid w-full max-w-sm items-center gap-1.5">
			<Label for="match-venue">Venue</Label>
			<Input type="text" id="match-venue" bind:value={data.venue} />

			<Select.Root>
				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder="" bind:value={data.venue} />
				</Select.Trigger>
				<Select.Content>
					{#each venues as venue}
						<Select.Item value={venue.value}>{venue.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			<ErrorLabel>{errors.venue}</ErrorLabel>
		</div>
		<!-- <input hidden bind:value={$formData.email} name={attrs.name} /> -->

		<div class="grid w-full max-w-sm items-center gap-1.5">
			<Label for="match-type">Type</Label>

			<Input type="text" id="match-type" bind:value={data.type} />
			<ErrorLabel>{errors.type}</ErrorLabel>
		</div>

		<div class="grid w-full gap-1.5">
			<Label for="match-address">Address</Label>
			<Textarea id="match-address" bind:value={data.address} />
			<ErrorLabel>{errors.address}</ErrorLabel>
		</div>

		<div class="mt-6 flex items-center justify-end gap-x-6">
			<Button href={`/match/${matchId}`} variant="outline">Cancel</Button>
			<Button type="submit">Save</Button>
		</div>
	</div>
</form>
<pre>{JSON.stringify(data, null, 2)}</pre>
