import { useState } from 'react';
import { QuerySource } from '../api/client';

interface AnswerCardProps {
  answer: string;
  sources: QuerySource[];
}

export function AnswerCard({ answer, sources }: AnswerCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Answer
        </h3>
        <div className="whitespace-pre-wrap rounded-lg bg-indigo-50 p-4 text-sm leading-relaxed text-slate-800">
          {answer}
        </div>
      </div>

      {sources.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mb-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            {expanded ? 'Hide' : 'Show'} {sources.length} source
            {sources.length !== 1 ? 's' : ''}
          </button>

          {expanded && (
            <ul className="space-y-2">
              {sources.map((source, idx) => (
                <li
                  key={`${source.item_id}-${idx}`}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-slate-900">
                      {source.title}
                    </span>
                    <span className="shrink-0 rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
                      {source.score.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{source.snippet}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
