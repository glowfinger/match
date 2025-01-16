<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getMatch } from '$lib/database/MatchService';

	import type { Club, Match } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import { page } from '$app/state';
	import { getClubs } from '$lib/database/ClubDbService';
	import Combobox from '$lib/components/ui/combobox/Combobox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Label } from '$lib/components/ui/label';

	const matchId = Number.parseInt(page.params.id);

	let match: Match | undefined = $state();
	let clubs: Club[] = $state([]);

	let data = $state({
		club: '',
		squad: '',
	});

	onMount(async () => {
		match = await getMatch(matchId);
		clubs = await getClubs();
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: 'Opposition', href: `/match/${matchId}/opposition` },
	];

	function clubToComboboxValue(club: Club) {
		return { value: club.key, label: club.name };
	}

	function handleSubmission(event: Event) {
		event.preventDefault();
		console.log(event.target);
	}
</script>

<div class="mt-4 grid grid-cols-1 gap-2">
	<Breadcrumb {breadcrumbs} />
	<HeadingLg>Opposition</HeadingLg>
	{#if !match}
		<p>Match not found</p>
	{:else}
		<form class="grid grid-cols-1 gap-2" onsubmit={handleSubmission}>
			<div class="grid w-full max-w-sm gap-1.5">
				<Label for="match-type">Type</Label>
				<Combobox
					values={clubs.map(clubToComboboxValue)}
					placeholder="Select an opposition"
					empty="No club found"
					bind:selectedValue={data.club}
				/>
			</div>
			<div class="grid w-full max-w-sm items-center gap-1.5">
				<Label for="match-type">Type</Label>

				<Input type="text" id="match-type" bind:value={data.squad} />
				<!-- <ErrorLabel>{errors.type}</ErrorLabel> -->
			</div>

			<Button type="submit">Save</Button>
		</form>
	{/if}
</div>
<pre>{JSON.stringify(data, null, 2)}</pre>
