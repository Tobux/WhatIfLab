<script lang="ts">
	let { value = $bindable('') } = $props();
</script>

<div class="card bg-base-100 shadow-sm">
	<div class="card-body p-4">
		<h2 class="card-title text-lg">System Prompt</h2>
		<div class="form-control">
			<textarea
				placeholder="Enter system prompt..."
				class="textarea-bordered textarea h-32 w-full resize-y"
				bind:value
			></textarea>
		</div>
	</div>
</div>
