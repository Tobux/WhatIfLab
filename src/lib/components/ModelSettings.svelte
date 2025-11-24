<script lang="ts">
	let { selectedModel = $bindable(), temperature = $bindable(), maxTokens = $bindable() } = $props();

	const models = [
		{ value: 'gpt-4o', label: 'GPT-4o' },
		{ value: 'gpt-4.1', label: 'GPT-4.1' },
		{ value: 'gpt-5.1', label: 'GPT-5.1' }
	];
</script>

<div class="card bg-base-100 shadow-sm">
	<div class="card-body p-4">
		<h2 class="card-title text-lg mb-2">Model Settings</h2>
		
		<div class="grid grid-cols-3 gap-4">
			<div class="form-control">
				<label class="label" for="model-select">
					<span class="label-text">Model</span>
				</label>
				<select
					id="model-select"
					class="select select-sm w-full"
					bind:value={selectedModel}
				>
					<option disabled value="">Select a model</option>
					{#each models as model (model.value)}
						<option value={model.value}>{model.label}</option>
					{/each}
				</select>
			</div>

			<div class="form-control">
				<label class="label" for="temperature-input">
					<span class="label-text">Temperature</span>
				</label>
				<input
					id="temperature-input"
					type="number"
					min="0"
					max="2"
					step="0.1"
					class="input input-bordered input-sm w-full"
					bind:value={temperature}
				/>
			</div>

			<div class="form-control">
				<label class="label" for="max-tokens-input">
					<span class="label-text">Max Tokens</span>
				</label>
				<input
					id="max-tokens-input"
					type="number"
					min="1"
					max="128000"
					class="input input-bordered input-sm w-full"
					bind:value={maxTokens}
				/>
			</div>
		</div>
	</div>
</div>
