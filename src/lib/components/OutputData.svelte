<script lang="ts">
	import OutputViewer from './OutputViewer.svelte';

	let { 
		rawOutput = $bindable(''),
		modifiedOutput = $bindable('')
	} = $props();
</script>

<div class="card bg-base-100 shadow-sm">
	<div class="card-body p-4">
		<h2 class="card-title text-lg mb-2">Output Data</h2>
		
		<div class="grid grid-cols-2 gap-4">
			<div class="form-control">
				<div class="label pb-1">
					<span class="label-text font-medium">Original Output (words not in modified output highlighted in red)</span>
				</div>
				<OutputViewer rawOutput={rawOutput} modifiedOutput={modifiedOutput} mode="original" />
			</div>

			<div class="form-control">
				<div class="label pb-1">
					<span class="label-text font-medium">Modified Output (words not in original output highlighted in green)</span>
				</div>
				<OutputViewer rawOutput={rawOutput} modifiedOutput={modifiedOutput} mode="modified" />
			</div>
		</div>
	</div>
</div>
