import { useCallback, useState } from 'react';
import {
  ingestNote,
  ingestUrl,
  IngestResponse,
} from '../api/client';

type IngestType = 'note' | 'url';

export function useIngest(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<IngestResponse | null>(null);

  const ingest = useCallback(
    async (type: IngestType, value: string) => {
      setLoading(true);
      setError(null);
      setLastResult(null);

      try {
        const result =
          type === 'note'
            ? await ingestNote(value)
            : await ingestUrl(value);
        setLastResult(result);
        onSuccess?.();
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to ingest content';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess],
  );

  return { ingest, loading, error, lastResult };
}
