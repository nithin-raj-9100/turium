import { FormEvent, useState } from 'react';

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

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Add Knowledge</h2>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setType('note')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            type === 'note'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Note
        </button>
        <button
          type="button"
          onClick={() => setType('url')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            type === 'url'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          URL
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'note' ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste or type your note..."
            rows={6}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            disabled={loading}
          />
        ) : (
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/article"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            disabled={loading}
          />
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || (type === 'note' ? !content.trim() : !url.trim())}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Saving...' : type === 'note' ? 'Save Note' : 'Fetch & Save URL'}
        </button>
      </form>
    </section>
  );
}
