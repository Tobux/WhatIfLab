import { generateText } from 'ai';
import { command } from '$app/server';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = createOpenAI({
  // custom settings, e.g.
  apiKey: OPENAI_API_KEY,
  headers: {
    'header-name': 'header-value',
  },
});

const GenerateSchema = z.object({
    prompt: z.string().min(1, 'Prompt is required'),
    systemPrompt: z.string(),
    model: z.string(),
    temperature: z.number(),
    maxTokens: z.number(),
    comments: z.array(
        z.object({
            id: z.string(),
            text: z.string(),
            selectedText: z.string(),
            start: z.number(),
            end: z.number()
        })
    )
});

export const generate = command(GenerateSchema, async (data) => {
    // Kick off the independent work in parallel
    const initialPromise = generateText({
        model: openai(data.model),
        prompt: data.prompt,
        system: data.systemPrompt,
        temperature: data.temperature,
        maxOutputTokens: data.maxTokens
    });

    const editedPromptPromise = generateText({
        model: openai(data.model),
        prompt: data.prompt,
        system: `Return the edited user prompt (with no extra text), based on the following comments:\n${data.comments.map(c => `Comment: ${c.text}\nSelected Text: ${c.selectedText}\n`).join('\n')}`,
        temperature: 0.5,
        maxOutputTokens: data.maxTokens
    });
    const editedPromptResult = await editedPromptPromise;

    const editedGenerationPromise = generateText({
        model: openai(data.model),
        prompt: editedPromptResult.text,
        system: data.systemPrompt,
        temperature: data.temperature,
        maxOutputTokens: data.maxTokens
    });

    // Wait for the remaining promises to complete.
    const [initialGeneration, editedGeneration] = await Promise.all([initialPromise, editedGenerationPromise]);

    console.log('---------generate.remote.ts---------'); 
    console.log('Settings: ', {
        model: data.model,
        temperature: data.temperature,
        maxTokens: data.maxTokens
    });
    console.log('------------------------------------');
    console.log('Initial Generation:', initialGeneration.text);
    console.log('Edited Prompt:', editedPromptResult.text);
    console.log('Edited Generation:', editedGeneration.text);
    console.log('--------/generate.remote.ts/--------'); 

	return {
		initialOutput: initialGeneration.text,
		editedOutput: editedGeneration.text,
		explanation: initialGeneration.text,
		initialUsage: initialGeneration.usage,
		editedUsage: editedGeneration.usage,
		initialFinishReason: initialGeneration.finishReason,
		editedFinishReason: editedGeneration.finishReason
	};
});
