<script lang="ts">
	import ModelSettings from '$lib/components/ModelSettings.svelte';
	import SystemPrompt from '$lib/components/SystemPrompt.svelte';
	import PromptEditor from '$lib/components/PromptEditor.svelte';
	import OutputData from '$lib/components/OutputData.svelte';
	import Statistics from '$lib/components/Statistics.svelte';
	import type { Comment } from '$lib/types';

	let selectedModel = $state('gpt-4.1');
	let temperature = $state(0.7);
	let maxTokens = $state(2048);
	let systemPrompt = $state('');
	let promptText = $state('');
	let promptComments = $state<Comment[]>([]);
	let rawOutput = $state('');
	let modifiedOutput = $state('');
	let outputStats = $state({
		time: 0,
		tokens: 0
	});

	function handleSubmit() {
		console.log('Submitting prompt...');
		console.log('Model:', selectedModel);
		console.log('Temperature:', temperature);
		console.log('Max Tokens:', maxTokens);
		console.log('System Prompt:', systemPrompt);
		console.log('Prompt:', promptText);
		console.log('Comments:', promptComments);
	}
</script>

<div class="space-y-4">
	<ModelSettings bind:selectedModel={selectedModel} bind:temperature={temperature} bind:maxTokens={maxTokens} />
	<SystemPrompt bind:value={systemPrompt} />
	<PromptEditor bind:value={promptText} bind:comments={promptComments} onsubmit={handleSubmit} />
	<OutputData bind:rawOutput={rawOutput} bind:modifiedOutput={modifiedOutput} />
	<Statistics bind:stats={outputStats} />
</div>