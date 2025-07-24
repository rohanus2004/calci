'use server';

/**
 * @fileOverview An AI agent that suggests engineering and scientific formulas based on a list of numbers.
 *
 * - suggestFormulas - A function that takes a list of numbers and returns formula suggestions.
 * - SuggestFormulasInput - The input type for the suggestFormulas function.
 * - SuggestFormulasOutput - The return type for the suggestFormulas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFormulasInputSchema = z.object({
  numbers: z
    .array(z.number())
    .describe('A list of numbers to generate formula suggestions for.'),
});
export type SuggestFormulasInput = z.infer<typeof SuggestFormulasInputSchema>;

const SuggestFormulasOutputSchema = z.object({
  formulas: z
    .array(z.string())
    .describe('A list of suggested engineering and scientific formulas.'),
});
export type SuggestFormulasOutput = z.infer<typeof SuggestFormulasOutputSchema>;

export async function suggestFormulas(input: SuggestFormulasInput): Promise<SuggestFormulasOutput> {
  return suggestFormulasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFormulasPrompt',
  input: {schema: SuggestFormulasInputSchema},
  output: {schema: SuggestFormulasOutputSchema},
  prompt: `You are an expert in engineering and scientific formulas. Given the following list of numbers, suggest relevant formulas that might apply to them. Return the formulas in a JSON format.

Numbers: {{{numbers}}}
`,
});

const suggestFormulasFlow = ai.defineFlow(
  {
    name: 'suggestFormulasFlow',
    inputSchema: SuggestFormulasInputSchema,
    outputSchema: SuggestFormulasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
