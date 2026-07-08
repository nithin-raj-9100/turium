import { IngestForm } from '@/components/IngestForm';
import { ItemList } from '@/components/ItemList';
import { QueryPanel } from '@/components/QueryPanel';
import { Separator } from '@/components/ui/separator';
import { useIngest } from '@/hooks/useIngest';
import { useItems } from '@/hooks/useItems';
import { useQuery } from '@/hooks/useQuery';

export default function App() {
  const { items, loading: itemsLoading, error: itemsError, refresh } = useItems();
  const { ingest, loading: ingestLoading, error: ingestError } = useIngest(refresh);
  const { ask, loading: queryLoading, error: queryError, result } = useQuery();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-[75rem] px-4 py-6 md:px-6">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            AI Knowledge Inbox
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Save notes and URLs, then ask questions grounded in your knowledge base.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[75rem] px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-8">
          <div className="flex flex-col gap-6">
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
          </div>

          <div className="lg:sticky lg:top-6">
            <QueryPanel
              onAsk={ask}
              loading={queryLoading}
              error={queryError}
              result={result}
            />
          </div>
        </div>
      </main>

      <Separator className="mt-auto" />
    </div>
  );
}
