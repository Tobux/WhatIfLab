<script lang="ts">
	let { value = $bindable('') } = $props();
</script>

<div class="card bg-base-100 shadow-sm">
	<div class="card-body p-4">
		<h2 class="card-title text-lg">RAW Output Data</h2>
		<div class="form-control">
			<textarea
				placeholder="Output will appear here..."
				class="textarea-bordered textarea h-48 w-full resize-y font-mono text-sm"
				bind:value
				readonly
			></textarea>
		</div>
	</div>
</div>
