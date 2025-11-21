<script lang="ts">
	let {
		show = $bindable(false),
		selectedText = '',
		commentText = $bindable(''),
		onAdd
	}: {
		show?: boolean;
		selectedText: string;
		commentText?: string;
		onAdd: () => void;
	} = $props();

	function handleCancel() {
		show = false;
		commentText = '';
	}

	function handleAdd() {
		onAdd();
		show = false;
	}
</script>

{#if show}
	<div class="modal-open modal">
		<div class="modal-box max-w-lg">
			<h3 class="mb-4 text-lg font-bold">Add Comment</h3>
			<div class="space-y-4">
				<div>
					<p class="label-text mb-1 font-medium">Selected text:</p>
					<div class="rounded-lg border border-blue-300 p-3">
						<p class="text-sm break-words">"{selectedText}"</p>
					</div>
				</div>
				<div class="form-control">
					<label class="label pb-1" for="comment-input">
						<span class="label-text font-medium">What would you like to modify?</span>
					</label>
					<textarea
						id="comment-input"
						class="textarea-bordered textarea h-32 w-full resize-none"
						placeholder="e.g., 'Change this to CAPS', 'Make this more formal'..."
						bind:value={commentText}
					></textarea>
				</div>
			</div>
			<div class="modal-action mt-6">
				<button class="btn btn-ghost" onclick={handleCancel}>Cancel</button>
				<button class="btn btn-primary" onclick={handleAdd} disabled={!commentText.trim()}
					>Add Comment</button
				>
			</div>
		</div>
	</div>
{/if}
