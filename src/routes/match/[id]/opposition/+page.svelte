<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getMatch, updateOpponent } from '$lib/database/MatchService';

	import type { Club, Match, MatchOpponent, MatchPosition } from '$lib/database/IndexedDB';
	import { onMount } from 'svelte';
	import HeadingLg from '$lib/components/typography/HeadingLg.svelte';
	import { page } from '$app/state';
	import { getClubs } from '$lib/database/ClubDbService';
	import Input from '$lib/components/ui/input/input.svelte';
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

	const matchId = Number.parseInt(page.params.id);

	let match: Match | undefined = $state();
	let options: { value: string; label: string }[] = $state([]);
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

	let selectedValue = $state<string | undefined>(undefined);

	onMount(async () => {
		match = await getMatch(matchId);

		if (match.opponent !== undefined) {
			data = { ...match.opponent };
		}

		clubs = await getClubs();

		options = clubs.map(clubToComboboxValue);

		selectedValue = data.club;
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

		if (selectedValue === undefined) {
			data.key = '';
			data.club = '';
			data.badge = '';
		} else {
			const club = clubs.find((c) => c.name === selectedValue);
			data.key = club?.key || '';
			data.club = club?.name || '';
			data.badge = club?.badge || '';
		}

		if (!isValid(data, matchOpponentSchema)) {
			errors = getErrors(data, matchOpponentSchema);
			return;
		}

		await updateOpponent(matchId, { ...data });
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
{#if !match}
	<p>Match not found</p>
{:else}
	<form class="grid grid-cols-1 gap-2" onsubmit={handleSubmission}>
		<div class="grid w-full max-w-sm gap-1.5">
			<Label for="match-type">Club</Label>

			<Popover.Root bind:open>
				<Popover.Trigger bind:ref={triggerRef}>
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
				<Popover.Content class="w-[200px] p-0">
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
		</div>
		<div class="grid w-full max-w-sm items-center gap-1.5">
			<Label for="match-type">squad</Label>
			<Input type="text" name="opposition-team" id="match-type" bind:value={data.squad} />
			<ErrorLabel>{errors.squad}</ErrorLabel>
		</div>

		<Separator />

		<Button href={`/match/${matchId}`} variant="outline">Cancel</Button>
		<Button type="submit">Save</Button>
	</form>
{/if}
