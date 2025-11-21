<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { untrack } from 'svelte';
	import type { Readable } from 'svelte/store';
	import { createEditor, EditorContent, type Editor } from 'svelte-tiptap';
	import StarterKit from '@tiptap/starter-kit';
	import { CommentMark } from './CommentMark';
	import { Decoration, DecorationSet } from '@tiptap/pm/view';
	import { Plugin, PluginKey } from '@tiptap/pm/state';

	interface Comment {
		id: string;
		text: string;
		start: number;
		end: number;
	}

	let {
		value = $bindable(''),
		comments,
		hoveredCommentId = undefined,
		onSelectionChange
	}: {
		value?: string;
		comments: Comment[];
		hoveredCommentId?: string | null;
		onSelectionChange?: (start: number, end: number, text: string) => void;
	} = $props();

	let editorStore: Readable<Editor> | undefined = $state();

	// Track previous value to avoid infinite loops
	let previousValue = value;
	let isApplyingMarks = false;

	onMount(() => {
		editorStore = createEditor({
			extensions: [
				StarterKit.configure({
					heading: false,
					codeBlock: false,
					code: false,
					blockquote: false,
					horizontalRule: false,
					bulletList: false,
					orderedList: false,
					listItem: false,
					bold: false,
					italic: false,
					strike: false
				}),
				CommentMark
			],
			content: value || '',
			editorProps: {
				attributes: {
					class:
						'textarea textarea-bordered w-full min-h-40 overflow-auto whitespace-pre-wrap break-words focus:outline-none p-3'
				}
			},
			onUpdate: ({ editor }) => {
				if (isApplyingMarks) return;

				const text = editor.getText();
				if (text !== value) {
					previousValue = text;
					value = text;
				}
			},
			onSelectionUpdate: ({ editor }) => {
				if (!onSelectionChange) return;

				const { from, to, empty } = editor.state.selection;
				if (empty) return;

				const selectedText = editor.state.doc.textBetween(from, to);
				if (!selectedText.trim()) return;

				// Convert Tiptap positions (1-based with doc node) to text positions (0-based)
				// Tiptap positions include the document node, so we subtract 1
				onSelectionChange(from - 1, to - 1, selectedText);
			}
		});
	});

	onDestroy(() => {
		if (editorStore) {
			$editorStore?.destroy();
		}
	});

	// Sync external value changes to editor
	$effect(() => {
		if (editorStore && value !== previousValue) {
			untrack(() => {
				const currentText = $editorStore?.getText() || '';
				if (currentText !== value) {
					$editorStore?.commands.setContent(value);
					previousValue = value;
				}
			});
		}
	});

	// Apply comment marks when comments change
	$effect(() => {
		// Only depend on comments array, track its length and contents
		const currentComments = [...comments];

		console.log('Applying comment marks:', currentComments);

		untrack(() => {
			if (!editorStore || !$editorStore) return;

			isApplyingMarks = true;

			try {
				const { state, view } = $editorStore;
				const { tr, doc, schema } = state;
				let transaction = tr;

				console.log('Document content size:', doc.content.size, 'Text:', $editorStore.getText());

				// Remove all existing comment marks first
				doc.descendants((node, pos) => {
					if (node.isText) {
						const commentMarks = node.marks.filter((mark) => mark.type.name === 'comment');
						if (commentMarks.length > 0) {
							commentMarks.forEach((mark) => {
								transaction = transaction.removeMark(
									pos,
									pos + node.nodeSize,
									schema.marks.comment
								);
							});
						}
					}
				});

				// Apply new comment marks
				for (const comment of currentComments) {
					// Tiptap positions: 0-based, but account for document structure
					const from = Math.max(1, Math.min(comment.start + 1, doc.content.size));
					const to = Math.max(from, Math.min(comment.end + 1, doc.content.size));

					console.log('Adding mark for comment:', comment.id, 'positions:', {
						from,
						to,
						originalStart: comment.start,
						originalEnd: comment.end
					});

					if (from < to && from >= 1 && to <= doc.content.size) {
						try {
							transaction = transaction.addMark(
								from,
								to,
								schema.marks.comment.create({ commentId: comment.id })
							);
						} catch (e) {
							console.error('Error applying comment mark:', e, { from, to, comment });
						}
					}
				}

				// Only dispatch if there were actual changes
				if (transaction.steps.length > 0) {
					console.log('Dispatching transaction with', transaction.steps.length, 'steps');
					view.dispatch(transaction.setMeta('addToHistory', false));
				}
			} finally {
				isApplyingMarks = false;
			}
		});
	});

	// Add hover effect when a comment is hovered
	$effect(() => {
		const currentHoveredId = hoveredCommentId;

		console.log('Hovered comment ID changed:', currentHoveredId);

		untrack(() => {
			if (!editorStore || !$editorStore) return;

			// Find the hovered comment
			const hoveredComment = currentHoveredId
				? comments.find((c) => c.id === currentHoveredId)
				: null;

			console.log('Hovered comment:', hoveredComment);

			if (hoveredComment) {
				isApplyingMarks = true;

				try {
					const { state, view } = $editorStore;
					const { tr, doc, schema } = state;
					let transaction = tr;

					const from = Math.max(1, Math.min(hoveredComment.start + 1, doc.content.size));
					const to = Math.max(from, Math.min(hoveredComment.end + 1, doc.content.size));

					console.log('Adding hover highlight:', { from, to });

					// Add a temporary decoration by creating a new mark with hover class
					if (from < to && from >= 1 && to <= doc.content.size) {
						// Remove existing hover marks first
						doc.descendants((node, pos) => {
							if (node.isText) {
								const marks = node.marks.filter(
									(mark) =>
										mark.type.name === 'comment' && mark.attrs.commentId === currentHoveredId
								);
								if (marks.length > 0) {
									// Update the mark to include hover state
									marks.forEach((mark) => {
										transaction = transaction.removeMark(
											pos,
											pos + node.nodeSize,
											schema.marks.comment
										);
										transaction = transaction.addMark(
											pos,
											pos + node.nodeSize,
											schema.marks.comment.create({
												commentId: mark.attrs.commentId,
												isHovered: true
											})
										);
									});
								}
							}
						});

						if (transaction.steps.length > 0) {
							view.dispatch(transaction.setMeta('addToHistory', false));
						}
					}
				} finally {
					isApplyingMarks = false;
				}
			} else {
				// Remove hover state from all marks
				isApplyingMarks = true;

				try {
					const { state, view } = $editorStore;
					const { tr, doc, schema } = state;
					let transaction = tr;

					doc.descendants((node, pos) => {
						if (node.isText) {
							const marks = node.marks.filter(
								(mark) => mark.type.name === 'comment' && mark.attrs.isHovered
							);
							if (marks.length > 0) {
								marks.forEach((mark) => {
									transaction = transaction.removeMark(
										pos,
										pos + node.nodeSize,
										schema.marks.comment
									);
									transaction = transaction.addMark(
										pos,
										pos + node.nodeSize,
										schema.marks.comment.create({
											commentId: mark.attrs.commentId,
											isHovered: false
										})
									);
								});
							}
						}
					});

					if (transaction.steps.length > 0) {
						view.dispatch(transaction.setMeta('addToHistory', false));
					}
				} finally {
					isApplyingMarks = false;
				}
			}
		});
	});
</script>

{#if editorStore && $editorStore}
	<EditorContent editor={$editorStore} />
{/if}
