'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Lightbulb } from 'lucide-react';
import { suggestFormulas } from '@/ai/flows/suggest-formulas';

interface FormState {
  formulas?: string[];
  error?: string | null;
}

const initialState: FormState = {
  formulas: [],
  error: null,
};

async function suggestAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const numbersStr = formData.get('numbers') as string;
  if (!numbersStr) {
    return { error: 'Please enter a list of numbers.' };
  }
  
  const numbers = numbersStr.split(/[\s,]+/).map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
  
  if (numbers.length === 0) {
    return { error: 'Please enter valid, comma-separated numbers.' };
  }
  
  try {
    const result = await suggestFormulas({ numbers });
    if (!result.formulas || result.formulas.length === 0) {
        return { error: "The AI couldn't find any relevant formulas for these numbers." };
    }
    return { formulas: result.formulas };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
      Suggest Formulas
    </Button>
  );
}

export function AiFormulaToolView() {
  const [state, formAction] = useActionState(suggestAction, initialState);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>AI Formula Suggester</CardTitle>
        <CardDescription>
          Enter a list of numbers (comma or space separated), and our AI will suggest relevant engineering and scientific formulas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <Textarea
            name="numbers"
            placeholder="e.g., 9.8, 10, 0.5"
            className="min-h-[100px] text-base"
            required
          />
          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>

        {state?.error && (
            <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
            </Alert>
        )}

        {state?.formulas && state.formulas.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Suggested Formulas:</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {state.formulas.map((formula, index) => (
                <Card key={index} className="bg-muted/50">
                  <CardContent className="p-4 flex items-center justify-center">
                    <p className="text-lg font-mono text-center">{formula}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
