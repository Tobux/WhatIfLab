<script lang="ts">
	let { selectedModel = $bindable('') } = $props();
</script>

<div class="card bg-base-100 shadow-sm">
	<div class="card-body p-4">
		<h2 class="card-title text-lg">Model Settings</h2>
		<div class="form-control">
			<input
				type="text"
				placeholder="Configure model settings here..."
				class="input-bordered input w-full"
				bind:value={selectedModel}
			/>
		</div>
	</div>
</div>
