const API_BASE = import.meta.env.VITE_API_URL ?? '';

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

export interface IngestResponse {
  id: string;
  source_type: 'note' | 'url';
  title: string;
  created_at: string;
  chunk_count: number;
}

export interface ItemSummary {
  id: string;
  source_type: 'note' | 'url';
  title: string;
  source_url: string | null;
  created_at: string;
  chunk_count: number;
  preview: string;
}

export interface QuerySource {
  item_id: string;
  title: string;
  snippet: string;
  score: number;
}

export interface QueryResponse {
  answer: string;
  sources: QuerySource[];
}

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiError | null;
    throw new Error(
      body?.error?.message ?? `Request failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}

export function ingestNote(content: string): Promise<IngestResponse> {
  return request('/api/ingest', {
    method: 'POST',
    body: JSON.stringify({ type: 'note', content }),
  });
}

export function ingestUrl(url: string): Promise<IngestResponse> {
  return request('/api/ingest', {
    method: 'POST',
    body: JSON.stringify({ type: 'url', url }),
  });
}

export function fetchItems(): Promise<{ items: ItemSummary[] }> {
  return request('/api/items');
}

export function queryKnowledge(
  question: string,
  topK = 5,
): Promise<QueryResponse> {
  return request('/api/query', {
    method: 'POST',
    body: JSON.stringify({ question, top_k: topK }),
  });
}
