import { FormEvent, useState } from 'react';
import { AlertCircleIcon } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface IngestFormProps {
  onIngest: (type: 'note' | 'url', value: string) => Promise<unknown>;
  loading: boolean;
  error: string | null;
}

export function IngestForm({ onIngest, loading, error }: IngestFormProps) {
  const [type, setType] = useState<'note' | 'url'>('note');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = type === 'note' ? content : url;
    if (!value.trim()) return;

    await onIngest(type, value.trim());

    if (type === 'note') {
      setContent('');
    } else {
      setUrl('');
    }
  }

  const canSubmit = type === 'note' ? content.trim().length > 0 : url.trim().length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Knowledge</CardTitle>
        <CardDescription>Save a note or fetch content from a URL.</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Type</FieldLabel>
              <ToggleGroup
                value={[type]}
                onValueChange={(value) => {
                  const next = value[0];
                  if (next === 'note' || next === 'url') {
                    setType(next);
                  }
                }}
                variant="outline"
                spacing={0}
              >
                <ToggleGroupItem value="note" className="min-w-20">
                  Note
                </ToggleGroupItem>
                <ToggleGroupItem value="url" className="min-w-20">
                  URL
                </ToggleGroupItem>
              </ToggleGroup>
            </Field>

            {type === 'note' ? (
              <Field>
                <FieldLabel htmlFor="note-content">Note</FieldLabel>
                <Textarea
                  id="note-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste or type your note..."
                  rows={6}
                  disabled={loading}
                />
              </Field>
            ) : (
              <Field>
                <FieldLabel htmlFor="url-input">URL</FieldLabel>
                <Input
                  id="url-input"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  disabled={loading}
                />
              </Field>
            )}
          </FieldGroup>

          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={loading || !canSubmit}>
            {loading && <Spinner data-icon="inline-start" />}
            {loading ? 'Saving...' : type === 'note' ? 'Save Note' : 'Fetch & Save URL'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
