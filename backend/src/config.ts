import path from 'path';
import dotenv from 'dotenv';

const nodeEnv = process.env.NODE_ENV ?? 'development';
const isProduction = nodeEnv === 'production';

if (!isProduction) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

export const config = {
  port: parseInt(process.env.PORT ?? '3001', 10),
  databasePath: process.env.DATABASE_PATH ?? './data/knowledge.db',
  nodeEnv,
  isProduction,
};

export function getGeminiApiKey(): string {
  return process.env.GEMINI_API_KEY?.trim() ?? '';
}

export function requireGeminiApiKey(): string {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  return apiKey;
}
