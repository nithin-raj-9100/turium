import { AlertCircleIcon, InboxIcon, RefreshCwIcon } from 'lucide-react';
import { ItemSummary } from '@/api/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface ItemListProps {
  items: ItemSummary[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

function ItemSkeleton() {
  return (
    <Card size="sm">
      <CardHeader>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-3 w-1/3" />
      </CardContent>
    </Card>
  );
}

export function ItemList({ items, loading, error, onRefresh }: ItemListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Items</CardTitle>
        <CardDescription>
          {items.length > 0
            ? `${items.length} item${items.length === 1 ? '' : 's'} in your knowledge base`
            : 'Your ingested notes and URLs appear here'}
        </CardDescription>
        <CardAction>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCwIcon data-icon="inline-start" />
            Refresh
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && items.length === 0 && (
          <div className="flex flex-col gap-3">
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <InboxIcon />
              </EmptyMedia>
              <EmptyTitle>No items yet</EmptyTitle>
              <EmptyDescription>
                Add a note or URL above to start building your knowledge base.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        {items.length > 0 && (
          <ScrollArea className="max-h-[32rem] pr-3">
            <div className="flex flex-col gap-3">
              {items.map((item, index) => (
                <div key={item.id} className="flex flex-col gap-3">
                  <Card size="sm" className="bg-muted/40 shadow-none ring-0">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="truncate">{item.title}</CardTitle>
                        <Badge variant={item.source_type === 'url' ? 'default' : 'secondary'}>
                          {item.source_type}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {item.preview}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>{formatDate(item.created_at)}</span>
                        <span>{item.chunk_count} chunks</span>
                        {item.source_url && (
                          <a
                            href={item.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent-foreground hover:underline"
                          >
                            Source
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  {index < items.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
