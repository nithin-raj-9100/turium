export interface ScoredChunk<T> {
  item: T;
  score: number;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dot / denominator;
}

export function topKBySimilarity<T extends { embedding: number[] }>(
  queryEmbedding: number[],
  items: T[],
  topK: number,
  minScore = 0.3,
): ScoredChunk<T>[] {
  const scored = items
    .map((item) => ({
      item,
      score: cosineSimilarity(queryEmbedding, item.embedding),
    }))
    .filter((s) => s.score >= minScore)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}
