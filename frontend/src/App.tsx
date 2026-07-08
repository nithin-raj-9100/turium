import { IngestForm } from './components/IngestForm';
import { ItemList } from './components/ItemList';
import { QueryPanel } from './components/QueryPanel';
import { useIngest } from './hooks/useIngest';
import { useItems } from './hooks/useItems';
import { useQuery } from './hooks/useQuery';

export default function App() {
  const { items, loading: itemsLoading, error: itemsError, refresh } = useItems();
  const { ingest, loading: ingestLoading, error: ingestError } = useIngest(refresh);
  const { ask, loading: queryLoading, error: queryError, result } = useQuery();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="text-2xl font-bold text-slate-900">AI Knowledge Inbox</h1>
          <p className="mt-1 text-sm text-slate-600">
            Save notes and URLs, then ask questions grounded in your knowledge base.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <IngestForm
          onIngest={ingest}
          loading={ingestLoading}
          error={ingestError}
        />

        <ItemList
          items={items}
          loading={itemsLoading}
          error={itemsError}
          onRefresh={refresh}
        />

        <QueryPanel
          onAsk={ask}
          loading={queryLoading}
          error={queryError}
          result={result}
        />
      </main>
    </div>
  );
}
