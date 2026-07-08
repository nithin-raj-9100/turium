import { FormEvent, useState } from 'react';
import { AnswerCard } from './AnswerCard';
import { QueryResponse } from '../api/client';

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
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Ask a Question</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What did I save about...?"
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          disabled={loading}
        />

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>

      {result && <AnswerCard answer={result.answer} sources={result.sources} />}
    </section>
  );
}
