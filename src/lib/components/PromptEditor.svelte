<script lang="ts">
	import CommentDialog from './CommentDialog.svelte';
	import CommentList from './CommentList.svelte';
	import HighlightedTextarea from './HighlightedTextarea.svelte';
	import type { Comment } from '$lib/types';

	let {
		value = $bindable(''),
		comments = $bindable<Comment[]>([]),
		onsubmit
	}: {
		value?: string;
		comments?: Comment[];
		onsubmit?: () => void;
	} = $props();

	let showCommentDialog = $state(false);
	let commentText = $state('');
	let selectedRange = $state<{ start: number; end: number; text: string } | null>(null);
	let hoveredCommentId = $state<string | null>(null);
	let editingComment = $state<Comment | null>(null);
	let editCommentText = $state('');

	// Automatically filter out comments that are out of range
	let validComments = $derived(comments.filter((comment) => comment.end <= value.length));

	function handleSelectionChange(start: number, end: number, text: string) {
		console.log('Selection changed:', { start, end, text });

		// Check if selection overlaps with existing comments
		const hasOverlap = validComments.some(
			(comment) =>
				(start >= comment.start && start < comment.end) ||
				(end > comment.start && end <= comment.end) ||
				(start <= comment.start && end >= comment.end)
		);

		console.log('Has overlap:', hasOverlap, 'existing comments:', validComments);

		if (!hasOverlap && text.trim()) {
			selectedRange = { start, end, text };
		} else {
			selectedRange = null;
		}
	}

	function handleAddComment() {
		if (!selectedRange || !commentText.trim()) return;

		const newComment: Comment = {
			id: crypto.randomUUID(),
			text: commentText.trim(),
			selectedText: selectedRange.text,
			start: selectedRange.start,
			end: selectedRange.end
		};

		console.log('Adding comment:', newComment);
		comments = [...comments, newComment];
		console.log('All comments after add:', comments);

		commentText = '';
		selectedRange = null;
		showCommentDialog = false;
	}

	function handleRemoveComment(id: string) {
		comments = comments.filter((c) => c.id !== id);
	}

	function handleEditComment(id: string) {
		const comment = comments.find((c) => c.id === id);
		if (comment) {
			editingComment = comment;
			editCommentText = comment.text;
		}
	}

	function handleSaveEdit() {
		if (!editingComment || !editCommentText.trim()) return;

		console.log('Saving edited comment:', editingComment.id, 'new text:', editCommentText);
		const commentId = editingComment.id;
		comments = comments.map((c) =>
			c.id === commentId ? { ...c, text: editCommentText.trim() } : c
		);

		editingComment = null;
		editCommentText = '';
	}

	function handleCancelEdit() {
		editingComment = null;
		editCommentText = '';
	}

	function openCommentDialog() {
		if (selectedRange) {
			showCommentDialog = true;
		}
	}

	let isAddCommentDisabled = $derived(!selectedRange);
	let addCommentTooltip = $derived(
		!selectedRange
			? 'Please select text first to add a comment'
			: 'Add a comment to the selected text'
	);
</script>

<div class="card bg-base-100 shadow-sm">
	<div class="card-body p-4">
		<div class="mb-3 flex items-center justify-between">
			<h2 class="card-title text-lg">Prompt (Data/Text)</h2>
			<div class="tooltip" data-tip="Highlight text and add comments for modifications">
				<div class="badge cursor-help badge-outline badge-info">?</div>
			</div>
		</div>

		<div class="flex items-start gap-4">
			<div class="flex-1 space-y-4">
				<HighlightedTextarea
					bind:value
					comments={validComments}
					{hoveredCommentId}
					onSelectionChange={handleSelectionChange}
				/>

				<div class="flex justify-end gap-2">
					<div class="tooltip" data-tip={addCommentTooltip}>
						<button
							class="btn btn-outline btn-sm"
							onclick={openCommentDialog}
							disabled={isAddCommentDisabled}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
								/>
							</svg>
							Add Comment
						</button>
					</div>
					<button class="btn btn-sm btn-primary" onclick={onsubmit}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
						</svg>
						Submit
					</button>
				</div>
			</div>

			<CommentList
				comments={validComments}
				onRemove={handleRemoveComment}
				onEdit={handleEditComment}
				onHover={(id) => (hoveredCommentId = id)}
				onHoverEnd={() => (hoveredCommentId = null)}
			/>
		</div>
	</div>
</div>

<CommentDialog
	bind:show={showCommentDialog}
	selectedText={selectedRange?.text ?? ''}
	bind:commentText
	onAdd={handleAddComment}
/>

{#if editingComment}
	<div class="modal-open modal">
		<div class="modal-box max-w-lg">
			<h3 class="mb-4 text-lg font-bold">Edit Comment</h3>
			<div class="space-y-4">
				<div>
					<p class="label-text mb-1 font-medium">Selected text:</p>
					<div class="rounded-lg border border-blue-300 p-3">
						<p class="text-sm break-words">"{editingComment.selectedText}"</p>
					</div>
				</div>
				<div class="form-control">
					<label class="label pb-1" for="edit-comment-input">
						<span class="label-text font-medium">Comment text:</span>
					</label>
					<textarea
						id="edit-comment-input"
						class="textarea-bordered textarea h-32 w-full resize-none"
						placeholder="e.g., 'Change this to CAPS', 'Make this more formal'..."
						bind:value={editCommentText}
					></textarea>
				</div>
			</div>
			<div class="modal-action mt-6">
				<button class="btn btn-ghost" onclick={handleCancelEdit}>Cancel</button>
				<button class="btn btn-primary" onclick={handleSaveEdit} disabled={!editCommentText.trim()}
					>Save Changes</button
				>
			</div>
		</div>
	</div>
{/if}
