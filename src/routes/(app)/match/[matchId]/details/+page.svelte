<script lang="ts">
	import { goto } from '$app/navigation';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import type { MatchDetail } from '$lib/database/IndexedDB';
	import { updateMatchDetail } from '$lib/database/MatchService';
	import { matchDetailSchema } from '$lib/validation/Schemas';
	import { getErrors, isValid } from '$lib/validation/Validator';
	import { toast } from 'svelte-sonner';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import CancelLink from '$lib/components/forms/CancelLink.svelte';
	import SubmitButton from '$lib/components/forms/SubmitButton.svelte';
	import type { LayoutProps } from '../$types';
	import { KIT_OPTIONS, VENUE_OPTIONS } from '$lib/data/MatchDetailOptions';
	import TextAreaInput from '$lib/components/forms/TextAreaInput.svelte';
	import SelectInput from '$lib/components/forms/SelectInput.svelte';

	let props: LayoutProps = $props();
	let matchId = props.data.matchId;
	let matchTile = props.data.matchTile;
	let match = props.data.match;

	let formData: MatchDetail = $state({
		venue: '',
		type: '',
		address: '',
		kit: '',
	});

	if (match.detail !== undefined) {
		formData = { ...match.detail };
	}

	let errors = $state({
		venue: '',
		type: '',
		address: '',
		kit: '',
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!isValid(formData, matchDetailSchema)) {
			const messageErrors: Record<string, string> = getErrors(formData, matchDetailSchema);
			errors = {
				venue: messageErrors.venue ?? '',
				type: messageErrors.type ?? '',
				address: messageErrors.address ?? '',
				kit: messageErrors.kit ?? '',
			};
			return;
		}

		updateMatchDetail(matchId, { ...formData });
		toast.success('Match details updated');
		goto(`/match/${matchId}`);
	}

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: matchTile, href: `/match/${matchId}` },
		{ name: 'Details', href: `/match/${matchId}/details` },
	];
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Details</HeadingLg>

<form onsubmit={handleSubmit} novalidate class="grid grid-cols-1 gap-2">
	<SelectInput
		id="match-details-venue"
		bind:value={formData.venue}
		title="Venue"
		error={errors.venue}
		options={VENUE_OPTIONS}
	/>
	<TextAreaInput
		id="match-details-type"
		bind:value={formData.type}
		title="Type"
		error={errors.type}
	/>
	<TextAreaInput
		id="match-details-address"
		bind:value={formData.address}
		title="Address"
		error={errors.address}
	/>
	<SelectInput
		id="match-details-kit"
		bind:value={formData.kit}
		title="Kit"
		error={errors.kit}
		options={KIT_OPTIONS}
	/>
	<Separator />
	<CancelLink href={`/match/${matchId}`}>Back to match details</CancelLink>
	<SubmitButton>Save</SubmitButton>
</form>
