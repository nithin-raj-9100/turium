import { GoogleGenAI } from '@google/genai';
import { config } from '../config';
import { AppError } from '../middleware/error-handler';
import { logger } from '../lib/logger';

const EMBEDDING_MODEL = 'gemini-embedding-2';
const EMBEDDING_DIMENSIONS = 768;

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!client) {
    client = new GoogleGenAI({ apiKey: config.geminiApiKey });
  }
  return client;
}

export function formatDocumentEmbedding(text: string, title: string): string {
  return `title: ${title} | text: ${text}`;
}

export function formatQueryEmbedding(question: string): string {
  return `task: question answering | query: ${question}`;
}

export async function embedText(text: string): Promise<number[]> {
  try {
    const ai = getClient();
    const response = await ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: text,
      config: {
        outputDimensionality: EMBEDDING_DIMENSIONS,
      },
    });

    const values = response.embeddings?.[0]?.values;
    if (!values || values.length === 0) {
      throw new Error('Empty embedding response');
    }

    return values;
  } catch (err) {
    logger.error({ err }, 'Embedding API failure');
    throw new AppError(502, 'EMBEDDING_API_ERROR', 'Failed to generate embedding');
  }
}

export async function embedDocuments(
  texts: string[],
  title: string,
): Promise<number[][]> {
  const embeddings: number[][] = [];
  for (const text of texts) {
    const formatted = formatDocumentEmbedding(text, title);
    const embedding = await embedText(formatted);
    embeddings.push(embedding);
  }
  return embeddings;
}

export async function embedQuery(question: string): Promise<number[]> {
  const formatted = formatQueryEmbedding(question);
  return embedText(formatted);
}
