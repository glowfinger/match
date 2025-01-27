<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getMatch, updateOpponent } from '$lib/database/MatchService';

	import type { Club, Match, MatchOpponent, MatchPosition } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import { page } from '$app/state';
	import { getClubs } from '$lib/database/ClubDbService';
	import Combobox from '$lib/components/ui/combobox/Combobox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Label } from '$lib/components/ui/label';
	import { getErrors, isValid } from '$lib/validation/Validator';
	import { matchOpponentSchema } from '$lib/validation/Schemas';
	import ErrorLabel from '$lib/components/forms/ErrorLabel.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	const matchId = Number.parseInt(page.params.id);

	let match: Match | undefined = $state();
	let clubs: Club[] = $state([]);

	let data = $state<MatchOpponent>({
		key: '',
		club: '',
		squad: '',
		badge: '',
	});

	let errors = $state({
		club: '',
		squad: '',
	});

	onMount(async () => {
		match = await getMatch(matchId);

		// TODO this is being overridden
		if (match.opponent !== undefined) {
			data = { ...match.opponent };
		}

		clubs = await getClubs();
	});

	$effect(() => {
		// TODO The combobox should be set a default value
		// TODO this should be from the key/value not the label
		const club = clubs.find((c) => c.name === data.club);

		if (club) {
			data.badge = club.badge;
			data.key = club.key;
		} else {
			data.badge = '';
			data.key = '';
		}
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: 'Opposition', href: `/match/${matchId}/opposition` },
	];

	function clubToComboboxValue(club: Club) {
		return { value: club.key, label: club.name };
	}

	async function handleSubmission(event: Event) {
		event.preventDefault();

		if (!isValid(data, matchOpponentSchema)) {
			errors = getErrors(data, matchOpponentSchema);
			return;
		}

		await updateOpponent(matchId, { ...data });
		toast.success('Opponent updated');
		goto(`/match/${matchId}`);
	}
</script>

<div class="mt-4 grid grid-cols-1 gap-2">
	<Breadcrumb {breadcrumbs} />
	<HeadingLg>Opposition</HeadingLg>
	{#if !match}
		<p>Match not found</p>
	{:else}
		<pre>{JSON.stringify(errors, null, 2)}</pre>
		<form class="grid grid-cols-1 gap-2" onsubmit={handleSubmission}>
			<div class="grid w-full max-w-sm gap-1.5">
				<Label for="match-type">Club</Label>
				<Combobox
					values={clubs.map(clubToComboboxValue)}
					placeholder="Select an opposition"
					empty="No club found"
					bind:selectedValue={data.club}
				/>
			</div>
			<div class="grid w-full max-w-sm items-center gap-1.5">
				<Label for="match-type">squad</Label>

				<Input type="text" id="match-type" bind:value={data.squad} />
				<ErrorLabel>{errors.squad}</ErrorLabel>
			</div>

			<Button type="submit">Save</Button>
		</form>
	{/if}
</div>
<pre>{JSON.stringify(data, null, 2)}</pre>
