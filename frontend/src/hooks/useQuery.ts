import { useCallback, useState } from 'react';
import { queryKnowledge, QueryResponse } from '../api/client';

export function useQuery() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QueryResponse | null>(null);

  const ask = useCallback(async (question: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await queryKnowledge(question);
      setResult(response);
      return response;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to get answer';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { ask, loading, error, result, reset };
}
