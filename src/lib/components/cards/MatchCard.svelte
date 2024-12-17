<script lang="ts">
	import type { Match } from '$lib/IndexedDB';

	type Props = {
		match: Match;
	};

	let { match }: Props = $props();
</script>

<div
	class="col-span-1 divide-y border border-gray-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
>
	<div class="grid grid-cols-3 divide-x">
		<div class="bg-orange-300">{match.team}</div>
		<div class="bg-red-300">{match.squad}</div>
		<div class="bg-green-300">03</div>
	</div>
	<div class="shrink-0">
		<img
			class="size-10 rounded-full"
			src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
			alt=""
		/>
	</div>
	<div class="min-w-0 flex-1">
		<a href={`/match/${match.id}`} class="focus:outline-none">
			<span class="absolute inset-0" aria-hidden="true"></span>
			<p class="text-sm font-medium text-gray-900"></p>
			<p class="truncate text-sm text-gray-500">{match.matchOn}</p>
		</a>
	</div>
	<div>
		<div class="-mt-px flex divide-x divide-gray-200">
			<div class="flex w-0 flex-1">
				<a
					href="mailto:janecooper@example.com"
					class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
				>
					<svg
						class="size-5 text-gray-400"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
						data-slot="icon"
					>
						<path
							d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z"
						/>
						<path
							d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z"
						/>
					</svg>
					Email
				</a>
			</div>
			<div class="-ml-px flex w-0 flex-1">
				<a
					href="tel:+1-202-555-0170"
					class="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
				>
					<svg
						class="size-5 text-gray-400"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
						data-slot="icon"
					>
						<path
							fill-rule="evenodd"
							d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z"
							clip-rule="evenodd"
						/>
					</svg>
					Call
				</a>
			</div>
		</div>
	</div>
</div>
