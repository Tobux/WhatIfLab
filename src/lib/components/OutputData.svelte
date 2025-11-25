<script lang="ts">
	import OutputViewer from './OutputViewer.svelte';

	let { rawOutput = $bindable(''), modifiedOutput = $bindable(''), enhancedPrompt = $bindable('') } = $props();

	function viewEnhancedPrompt() {
		alert(enhancedPrompt);
	}

	function viewAIExplanation() {
		// TODO
	}
</script>

<div class="card bg-base-100 shadow-sm">
	<div class="card-body p-4">
		<h2 class="mb-2 card-title text-lg">Output Data</h2>

		<div class="grid grid-cols-2 gap-4 space-y-2">
			<div class="form-control">
				<div class="label pb-1">
					<span class="label-text font-medium"
						>Original Output (words not in modified output highlighted in red)</span
					>
				</div>
				<OutputViewer {rawOutput} {modifiedOutput} mode="original" />
			</div>

			<div class="form-control">
				<div class="label pb-1">
					<span class="label-text font-medium"
						>Modified Output (words not in original output highlighted in green)</span
					>
				</div>
				<OutputViewer {rawOutput} {modifiedOutput} mode="modified" />
			</div>
		</div>
		<div class="flex justify-end gap-2">
			<button class="btn btn-outline btn-sm" onclick={viewEnhancedPrompt}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path d="M8 6h8M8 10h8M8 14h4" /><rect
						x="3"
						y="3"
						width="18"
						height="18"
						rx="2"
						ry="2"
					/></svg
				>
				View Enhanced Prompt
			</button>
			<button class="btn flex items-center gap-1 btn-outline btn-sm" onclick={viewAIExplanation}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect
						x="9"
						y="9"
						width="6"
						height="6"
					></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"
					></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"
					></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"
					></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"
					></line></svg
				>
				View AI Explanation
			</button>
		</div>
	</div>
</div>
