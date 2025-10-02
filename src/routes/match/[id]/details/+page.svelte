<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import ErrorLabel from '$lib/components/forms/ErrorLabel.svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { Match, MatchDetail } from '$lib/database/IndexedDB';
	import { getMatch, updateMatchDetail } from '$lib/database/MatchService';
	import { matchDetailSchema } from '$lib/validation/Schemas';
	import { getErrors, isValid } from '$lib/validation/Validator';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { KIT_VALUES } from '$lib/canvas/constants/Colours';

	let match: Match | undefined = $state();
	const matchId = Number.parseInt(page.params.id as string);

	let data: MatchDetail = $state({
		venue: '',
		type: '',
		address: '',
		kit: '',
	});

	let errors = $state({
		venue: '',
		type: '',
		address: '',
		kit: '',
	});

	onMount(async () => {
		match = await getMatch(matchId);
		if (match.detail !== undefined) {
			data = { ...match.detail };
		}
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!isValid(data, matchDetailSchema)) {
			errors = getErrors(data, matchDetailSchema);
			return;
		}

		updateMatchDetail(matchId, { ...data });
		toast.success('Match details updated');
		goto(`/match/${matchId}`);
	}

	const venues = [
		{ value: 'HOME', label: 'Home' },
		{ value: 'AWAY', label: 'Away' },
		{ value: 'NEUTRAL', label: 'Neutral' },
	];

	const kitOptions = [
		{ value: KIT_VALUES.MAIN, label: 'Main' },
		{ value: KIT_VALUES.SECONDARY, label: 'Secondary' },
	];

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: 'Match', href: `/match/${matchId}` },
		{ name: 'Details', href: `/match/${matchId}/details` },
	];
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Details</HeadingLg>
{#if !match}
	<p>Match not found</p>
{:else}
	<form onsubmit={handleSubmit} novalidate>
		<div class="mt-2 grid grid-cols-1 gap-4">
			<div class="grid w-full max-w-sm items-center gap-1.5">
				<Label for="match-details-venue">Venue</Label>
				<Select.Root type="single" bind:value={data.venue}>
					<Select.Trigger class="w-full">
						{data.venue ? data.venue : 'Select a venue'}
					</Select.Trigger>
					<Select.Content>
						{#each venues as venue}
							<Select.Item value={venue.value}>{venue.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>

				<ErrorLabel>{errors.venue}</ErrorLabel>
			</div>

			<div class="grid w-full max-w-sm items-center gap-1.5">
				<Label for="match-details-type">Type</Label>

				<Textarea id="match-details-type" bind:value={data.type} />
				<ErrorLabel>{errors.type}</ErrorLabel>
			</div>

			<div class="grid w-full gap-1.5">
				<Label for="match-details-address">Address</Label>
				<Textarea id="match-details-address" bind:value={data.address} />
				<ErrorLabel>{errors.address}</ErrorLabel>
			</div>

			<div class="grid w-full max-w-sm items-center gap-1.5">
				<Label for="match-details-kit">Kit</Label>

				<Select.Root type="single" bind:value={data.kit}>
					<Select.Trigger class="w-full">
						{data.kit ? data.kit : 'Select a kit'}
					</Select.Trigger>
					<Select.Content>
						{#each kitOptions as kit}
							<Select.Item value={kit.value}>{kit.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>

				<ErrorLabel>{errors.kit}</ErrorLabel>
			</div>
			<Separator />
			<Button href={`/match/${matchId}`} variant="outline">Cancel</Button>
			<Button type="submit">Save</Button>
		</div>
	</form>
{/if}
