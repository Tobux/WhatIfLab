<script lang="ts">
	import CommentItem from './CommentItem.svelte';
	import type { Comment } from '$lib/types';

	let {
		comments,
		onRemove,
		onEdit,
		onHover,
		onHoverEnd
	}: {
		comments: Comment[];
		onRemove: (id: string) => void;
		onEdit: (id: string) => void;
		onHover?: (id: string) => void;
		onHoverEnd?: () => void;
	} = $props();
</script>

{#if comments.length > 0}
	<div class="w-80 shrink-0">
		<h3 class="mb-2 text-sm font-semibold">Comments</h3>
		<div class="max-h-[500px] space-y-2 overflow-y-auto pr-2">
			{#each comments as comment (comment.id)}
				<div
					role="button"
					tabindex="0"
					onmouseenter={() => onHover?.(comment.id)}
					onmouseleave={() => onHoverEnd?.()}
				>
					<CommentItem
						selectedText={comment.selectedText}
						commentText={comment.text}
						onEdit={() => onEdit(comment.id)}
						onRemove={() => onRemove(comment.id)}
					/>
				</div>
			{/each}
		</div>
	</div>
{/if}
