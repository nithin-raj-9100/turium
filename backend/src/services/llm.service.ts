import { GoogleGenAI } from '@google/genai';
import { config, requireGeminiApiKey } from '../config';
import { AppError } from '../middleware/error-handler';
import { logger } from '../lib/logger';

const LLM_MODEL = 'gemini-3.1-flash-lite';

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  requireGeminiApiKey();
  if (!client) {
    client = new GoogleGenAI({ apiKey: config.geminiApiKey });
  }
  return client;
}

export interface ContextBlock {
  index: number;
  title: string;
  text: string;
}

export function buildRagPrompt(question: string, contexts: ContextBlock[]): string {
  const contextSection = contexts
    .map((c) => `[${c.index}] (title: ${c.title})\n${c.text}`)
    .join('\n\n');

  return `You are a helpful assistant that answers questions based only on the provided context.

Answer ONLY from the provided context. If the answer is not in the context, say "I don't have enough information in your saved notes to answer that."

Cite sources as [1], [2], etc. matching the context block numbers.

Context:
${contextSection}

Question: ${question}`;
}

export async function generateAnswer(prompt: string): Promise<string> {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: LLM_MODEL,
      contents: prompt,
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty LLM response');
    }

    return text.trim();
  } catch (err) {
    if (err instanceof AppError) throw err;
    logger.error({ err }, 'LLM API failure');
    throw new AppError(502, 'LLM_API_ERROR', 'Failed to generate answer');
  }
}
