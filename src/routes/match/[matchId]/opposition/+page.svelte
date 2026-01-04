<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { updateOpponent } from '$lib/database/MatchService';
	import type { Club, MatchOpponent } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import { getClubs } from '$lib/database/ClubDbService';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Label } from '$lib/components/ui/label';
	import { getErrors, isValid } from '$lib/validation/Validator';
	import { matchOpponentSchema } from '$lib/validation/Schemas';
	import ErrorLabel from '$lib/components/forms/ErrorLabel.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils.js';
	import { Separator } from '$lib/components/ui/separator';
	import type { LayoutProps } from '../$types';
	import CancelLink from '$lib/components/forms/CancelLink.svelte';
	import SubmitButton from '$lib/components/forms/SubmitButton.svelte';
	import TextInput from '$lib/components/forms/TextInput.svelte';

	let props: LayoutProps = $props();
	let matchId = props.data.matchId;
	let matchTile = props.data.matchTile;
	let match = props.data.match;

	let options: { value: string; label: string }[] = $state([]);
	let clubs: Club[] = $state([]);

	let formData = $state<MatchOpponent>({
		key: '',
		code: '',
		club: '',
		squad: '',
		badge: '',
	});

	if (match.opponent !== undefined) {
		formData = { ...match.opponent };
	}

	let errors = $state({
		club: '',
		squad: '',
	});

	let selectedValue = $state<string | undefined>(undefined);

	onMount(async () => {
		clubs = await getClubs();
		options = clubs.map(clubToComboboxValue);
		selectedValue = formData.club;
	});

	const breadcrumbs = [
		{ name: 'Home', href: '/' },
		{ name: matchTile, href: `/match/${matchId}` },
		{ name: 'Manage lineup', href: `/match/${matchId}/opposition` },
	];

	function clubToComboboxValue(club: Club) {
		return { value: club.key, label: club.name };
	}

	async function handleSubmission(event: Event) {
		event.preventDefault();

		if (selectedValue === undefined) {
			formData.key = '';
			formData.club = '';
			formData.badge = '';
		} else {
			const club = clubs.find((c) => c.name === selectedValue);
			formData.key = club?.key || '';
			formData.club = club?.name || '';
			formData.badge = club?.badge || '';
			formData.code = club?.code || '';
		}

		if (!isValid(formData, matchOpponentSchema)) {
			errors = getErrors(formData, matchOpponentSchema);
			return;
		}

		await updateOpponent(matchId, { ...formData });
		toast.success('Opponent updated');
		goto(`/match/${matchId}`);
	}

	let open = $state(false);
	let value = $state('');
	let triggerRef = $state<HTMLButtonElement>(null!);

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}

	$effect(() => {
		if (value === '') {
			selectedValue = '';
			return;
		}
		selectedValue = options.find((f) => f.value === value)?.label;
	});
</script>

<Breadcrumb {breadcrumbs} />
<HeadingLg>Opposition</HeadingLg>

<form class="grid grid-cols-1 gap-2" onsubmit={handleSubmission}>
	<Label for="match-opposition-club">Club</Label>
	<Popover.Root bind:open>
		<Popover.Trigger bind:ref={triggerRef} class="w-full bg-white">
			{#snippet child({ props })}
				<Button
					variant="outline"
					class="w-full justify-between"
					{...props}
					role="combobox"
					aria-expanded={open}
				>
					{selectedValue || 'Select a club...'}
					<ChevronsUpDown class="opacity-50" />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="bg-white p-0">
			<Command.Root>
				<Command.Input placeholder="Search clubs..." />
				<Command.List>
					<Command.Empty>No club found.</Command.Empty>
					<Command.Group>
						{#each options as option}
							<Command.Item
								value={option.value}
								onSelect={() => {
									value = option.value;
									closeAndFocusTrigger();
								}}
							>
								<Check class={cn(value !== option.value && 'text-transparent')} />
								{option.label}
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
	<ErrorLabel>{errors.club}</ErrorLabel>

	<TextInput
		id="match-opposition-squad"
		bind:value={formData.squad}
		title="Squad"
		placeholder="Enter squad name"
		error={errors.squad}
	/>
	<Separator />
	<CancelLink href={`/match/${matchId}`}>Back to match details</CancelLink>
	<SubmitButton>Save</SubmitButton>
</form>
