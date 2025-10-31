<script lang="ts">
	type Props = {
		file?: File;
	};
	let { file = $bindable() }: Props = $props();

	let dragActive = $state(false);
	let imageUrl = $state<string | null>(null);

	function createImageUrl(f: File) {
		if (imageUrl) {
			URL.revokeObjectURL(imageUrl);
		}
		imageUrl = URL.createObjectURL(f);
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragActive = false;

		if (event.dataTransfer?.files.length) {
			file = event.dataTransfer.files[0];
			createImageUrl(file);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragActive = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		dragActive = false;
	}

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files?.length) {
			file = input.files[0];
			createImageUrl(file);
		}
	}

	function handleClick(e: MouseEvent | KeyboardEvent) {
		e.preventDefault();
		e.stopPropagation();
		document.getElementById('file-input')?.click();
	}

	$effect(() => {
		if (file && !imageUrl) {
			createImageUrl(file);
		} else if (!file && imageUrl) {
			URL.revokeObjectURL(imageUrl);
			imageUrl = null;
		}
	});

	$effect(() => {
		return () => {
			if (imageUrl) {
				URL.revokeObjectURL(imageUrl);
			}
		};
	});
</script>

<button
	tabindex="0"
	class="dropzone aspect-video cursor-pointer overflow-hidden rounded-xl border-2 border-dashed text-center transition-colors duration-200"
	class:bg-blue-100={dragActive}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	onclick={handleClick}
>
	{#if imageUrl}
		<img src={imageUrl} alt="Upload preview" class="max-w-full" />
	{:else}
		<p class="text-gray-600">Drag & drop files here or click to upload</p>
	{/if}
	<input
		id="file-input"
		type="file"
		class="hidden"
		accept="image/png, image/jpeg"
		onchange={handleFileSelect}
		onclick={(e) => {
			e.stopPropagation();
		}}
	/>
</button>

{#if file}
	<div class="mt-4 space-y-2">
		<h3 class="font-semibold">Selected files:</h3>

		<ul class="text-sm text-gray-700">
			<li>{file.name} ({Math.round(file.size / 1024)} KB)</li>
		</ul>
	</div>
{/if}

<style>
	.dropzone {
		border-color: #ccc;
	}
	.dropzone.bg-blue-100 {
		border-color: #3b82f6;
		background-color: #eff6ff;
	}
</style>
