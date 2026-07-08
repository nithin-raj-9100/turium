import { FormEvent, useState } from 'react';
import { AlertCircleIcon } from 'lucide-react';
import { QueryResponse } from '@/api/client';
import { AnswerCard } from '@/components/AnswerCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

interface QueryPanelProps {
  onAsk: (question: string) => Promise<unknown>;
  loading: boolean;
  error: string | null;
  result: QueryResponse | null;
}

export function QueryPanel({ onAsk, loading, error, result }: QueryPanelProps) {
  const [question, setQuestion] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    await onAsk(question.trim());
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Ask a Question</CardTitle>
        <CardDescription>
          Query your saved knowledge with natural language.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="question">Question</FieldLabel>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What did I save about...?"
                rows={3}
                disabled={loading}
              />
            </Field>
          </FieldGroup>

          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={loading || !question.trim()}>
            {loading && <Spinner data-icon="inline-start" />}
            {loading ? 'Thinking...' : 'Ask'}
          </Button>
        </CardFooter>
      </form>

      {result && (
        <>
          <Separator />
          <CardContent>
            <AnswerCard answer={result.answer} sources={result.sources} />
          </CardContent>
        </>
      )}
    </Card>
  );
}
