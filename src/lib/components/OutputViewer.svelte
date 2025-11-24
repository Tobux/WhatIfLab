<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { untrack } from 'svelte';
	import type { Readable } from 'svelte/store';
	import { createEditor, EditorContent, type Editor } from 'svelte-tiptap';
	import StarterKit from '@tiptap/starter-kit';
	import { DiffMark } from './DiffMark';

	let {
		rawOutput = '',
		modifiedOutput = '',
		mode = 'modified'
	}: {
		rawOutput: string;
		modifiedOutput: string;
		mode?: 'original' | 'modified';
	} = $props();

	let editorStore: Readable<Editor> | undefined = $state();
	let previousRawOutput = rawOutput;
	let previousModifiedOutput = modifiedOutput;
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
				DiffMark
			],
			content: mode === 'original' ? rawOutput : modifiedOutput || '',
			editable: false,
			editorProps: {
				attributes: {
					class:
						'textarea textarea-bordered w-full min-h-40 overflow-auto whitespace-pre-wrap break-words focus:outline-none p-3 bg-base-200'
				}
			}
		});
	});

	onDestroy(() => {
		if (editorStore) {
			$editorStore?.destroy();
		}
	});

	$effect(() => {
		const currentRawOutput = rawOutput;
		const currentModifiedOutput = modifiedOutput;
		
		untrack(() => {
			if (!editorStore || !$editorStore) return;
			
			if (currentRawOutput !== previousRawOutput || currentModifiedOutput !== previousModifiedOutput) {
				isApplyingMarks = true;
				
				try {
					console.log('OutputViewer - Computing diff:', { 
						rawOutput: currentRawOutput, 
						modifiedOutput: currentModifiedOutput,
						mode
					});
					
					previousRawOutput = currentRawOutput;
					previousModifiedOutput = currentModifiedOutput;
					
					// Apply diff marks if we have both outputs to compare
					if (currentModifiedOutput && currentRawOutput) {
						// Split into words while preserving whitespace
						const rawWords = currentRawOutput.split(/(\s+)/);
						const modifiedWords = currentModifiedOutput.split(/(\s+)/);
						
						// Create sets for quick lookup (only non-whitespace words)
						const rawWordSet = new Set(rawWords.filter(w => w.trim()));
						const modifiedWordSet = new Set(modifiedWords.filter(w => w.trim()));
						
						let htmlContent = '';
						
						if (mode === 'original') {
							// Original mode: display raw output with words not in modified output highlighted in red
							for (const word of rawWords) {
								if (!word.trim()) {
									// Preserve whitespace
									htmlContent += word;
								} else if (!modifiedWordSet.has(word)) {
									// Word exists in raw but not in modified - removed
									htmlContent += `<span data-diff-type="removed" class="bg-red-200 text-red-900 line-through">${word}</span>`;
								} else {
									// Word exists in both - unchanged
									htmlContent += word;
								}
							}
						} else {
							// Modified mode: display modified output with words not in raw output highlighted in green
							for (const word of modifiedWords) {
								if (!word.trim()) {
									// Preserve whitespace
									htmlContent += word;
								} else if (!rawWordSet.has(word)) {
									// Word exists in modified but not in raw - added
									htmlContent += `<span data-diff-type="added" class="bg-green-200 text-green-900">${word}</span>`;
								} else {
									// Word exists in both - unchanged
									htmlContent += word;
								}
							}
						}
						
						console.log('OutputViewer - HTML content:', htmlContent);
						
						// Set content with HTML to preserve marks
						$editorStore.commands.setContent(htmlContent);
					} else {
						// No comparison available, just set the appropriate content based on mode
						if (mode === 'original') {
							$editorStore.commands.setContent(currentRawOutput);
						} else {
							$editorStore.commands.setContent(currentModifiedOutput || currentRawOutput);
						}
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
