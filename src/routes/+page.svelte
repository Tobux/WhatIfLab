<script lang="ts">
	import ModelSettings from '$lib/components/ModelSettings.svelte';
	import SystemPrompt from '$lib/components/SystemPrompt.svelte';
	import PromptEditor from '$lib/components/PromptEditor.svelte';
	import OutputData from '$lib/components/OutputData.svelte';
	import Statistics from '$lib/components/Statistics.svelte';
	import type { Comment } from '$lib/types';
	import { generate } from './generate.remote';

	let selectedModel = $state('gpt-4.1');
	let temperature = $state(0.7);
	let maxTokens = $state(2048);
	let systemPrompt = $state('');
	let promptText = $state('');
	let promptComments = $state<Comment[]>([]);
	let enhancedPrompt = $state('');
	let rawOutput = $state('');
	let modifiedOutput = $state('');
	let outputStats = $state({
		time: 0,
		tokens: 0
	});
	let isGenerating = $state(false);

	async function handleSubmit() {
		if (!promptText.trim()) {
			alert('Please enter a prompt');
			return;
		}

		isGenerating = true;
		const startTime = performance.now();

		try {
			const result = await generate({
				model: selectedModel,
				temperature: temperature,
				maxTokens: maxTokens,
				systemPrompt: systemPrompt,
				prompt: promptText,
				comments: promptComments
			});

			const endTime = performance.now();
			const timeInSeconds = (endTime - startTime) / 1000;

			rawOutput = result.initialOutput;
			modifiedOutput = result.editedOutput;
			enhancedPrompt = result.enhancedPrompt;
			outputStats = {
				time: timeInSeconds,
				tokens: (result.initialUsage?.totalTokens || 0) + (result.editedUsage?.totalTokens || 0)
			};

			console.log('Generation complete:', result);
		} catch (error) {
			console.error('Generation error:', error);
			alert('Failed to generate text. Please check your API key and try again.');
		} finally {
			isGenerating = false;
		}
	}
</script>

<div class="space-y-4">
	<ModelSettings bind:selectedModel={selectedModel} bind:temperature={temperature} bind:maxTokens={maxTokens} />
	<SystemPrompt bind:value={systemPrompt} />
	<PromptEditor bind:value={promptText} bind:comments={promptComments} onsubmit={handleSubmit} bind:isGenerating={isGenerating} />
	<OutputData bind:rawOutput={rawOutput} bind:modifiedOutput={modifiedOutput} bind:enhancedPrompt={enhancedPrompt} />
	<Statistics bind:stats={outputStats} />
</div>