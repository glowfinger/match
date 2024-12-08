<script lang="ts">
	import { goto } from '$app/navigation';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import DateInput from '$lib/components/forms/DateInput.svelte';
	import SelectInput from '$lib/components/forms/SelectInput.svelte';
	import SubmitButton from '$lib/components/forms/SubmitButton.svelte';
	import TextInput from '$lib/components/forms/TextInput.svelte';
	import Warning from '$lib/components/icons/Warning.svelte';
	import { addMatch, isMatch } from '$lib/database/MatchService';
	import { matchSchema } from '$lib/validation/Schemas';
	import { isValid, getErrors } from '$lib/validation/Validator';
	import { fade } from 'svelte/transition';

	let saving = $state(false);

	let warning = $state('');

	let data = $state({
		matchOn: '2024-12-08',
		team: 'chipstead-senior',
		type: 'match',
		squad: '1XV',
	});

	let errors = $state({
		matchOn: '',
		team: '',
		type: '',
		squad: '',
	});

	const teams = [{ value: 'chipstead-senior', label: 'Senior' }];

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		saving = true;
		warning = '';

		if (!isValid(data, matchSchema)) {
			saving = false;
			errors = getErrors(data, matchSchema);
			return;
		}

		if (await isMatch(data)) {
			warning = 'This match already exists';
			saving = false;
			return;
		}

		const { id } = await addMatch(data);
		goto(`/match/${id}`);
	}
	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'New match', href: '/match/new' },
	];
</script>

<div class="grid grid-cols-1 gap-2">
	<h1 class="h1">New match</h1>
	<Breadcrumb {breadcrumbs} />
	<hr />
	<form onsubmit={handleSubmit} class="grid grid-cols-1 gap-4">
		{#if warning}
			<aside class="alert variant-ghost" transition:fade={{ duration: 200 }}>
				<Warning />
				<div class="alert-message">
					<h3 class="h3">Warning</h3>
					<p>{warning}</p>
				</div>
			</aside>
		{/if}

		<DateInput
			title="Match on"
			bind:value={data.matchOn}
			error={errors.matchOn}
			disabled={saving}
		/>
		<SelectInput
			title="Team"
			bind:value={data.team}
			options={teams}
			error={errors.team}
			disabled={saving}
		/>
		<input type="hidden" bind:value={data.type} />
		<TextInput title="Squad" bind:value={data.squad} error={errors.squad} disabled={saving} />
		<SubmitButton title="Add match" disabled={saving} />
	</form>
</div>

<pre>{JSON.stringify(data, null, 2)}</pre>
<pre>{JSON.stringify(errors, null, 2)}</pre>
