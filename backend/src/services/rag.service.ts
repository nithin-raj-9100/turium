import { countItems } from '../db/repositories/items.repository';
import { getAllChunksWithItems } from '../db/repositories/chunks.repository';
import { topKBySimilarity } from '../lib/vector-search';
import { embedQuery } from './embedding.service';
import { buildRagPrompt, generateAnswer, ContextBlock } from './llm.service';
import { AppError } from '../middleware/error-handler';

export interface QueryInput {
  question: string;
  top_k?: number;
}

export interface QuerySource {
  item_id: string;
  title: string;
  snippet: string;
  score: number;
}

export interface QueryResult {
  answer: string;
  sources: QuerySource[];
}

export async function queryKnowledge(input: QueryInput): Promise<QueryResult> {
  const question = input.question.trim();
  const topK = input.top_k ?? 5;

  if (countItems() === 0) {
    throw new AppError(404, 'NO_ITEMS', 'No items have been ingested yet');
  }

  const allChunks = getAllChunksWithItems();
  if (allChunks.length === 0) {
    throw new AppError(404, 'NO_ITEMS', 'No items have been ingested yet');
  }

  const queryEmbedding = await embedQuery(question);
  const ranked = topKBySimilarity(queryEmbedding, allChunks, topK, 0.3);

  if (ranked.length === 0) {
    return {
      answer:
        "I don't have enough relevant information in your saved notes to answer that question.",
      sources: [],
    };
  }

  const contextBlocks: ContextBlock[] = ranked.map((r, i) => ({
    index: i + 1,
    title: r.item.item_title,
    text: r.item.text,
  }));

  const prompt = buildRagPrompt(question, contextBlocks);
  const answer = await generateAnswer(prompt);

  const sources: QuerySource[] = ranked.map((r) => ({
    item_id: r.item.item_id,
    title: r.item.item_title,
    snippet: r.item.text.length > 300 ? `${r.item.text.slice(0, 300)}...` : r.item.text,
    score: Math.round(r.score * 100) / 100,
  }));

  return { answer, sources };
}
