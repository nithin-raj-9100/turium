import { ItemSummary } from '../api/client';

interface ItemListProps {
  items: ItemSummary[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

export function ItemList({ items, loading, error, onRefresh }: ItemListProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Saved Items</h2>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {loading && items.length === 0 && (
        <p className="text-sm text-slate-500">Loading items...</p>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="text-sm text-slate-500">
          No items yet. Add a note or URL to get started.
        </p>
      )}

      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border border-slate-100 bg-slate-50 p-4"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="font-medium text-slate-900">{item.title}</h3>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                  item.source_type === 'url'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {item.source_type}
              </span>
            </div>

            <p className="mb-2 line-clamp-2 text-sm text-slate-600">
              {item.preview}
            </p>

            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
              <span>{formatDate(item.created_at)}</span>
              <span>{item.chunk_count} chunks</span>
              {item.source_url && (
                <a
                  href={item.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  Source
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
