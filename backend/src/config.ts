import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT ?? '3001', 10),
  geminiApiKey: process.env.GEMINI_API_KEY ?? '',
  databasePath: process.env.DATABASE_PATH ?? './data/knowledge.db',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export function validateConfig(): void {
  if (!config.geminiApiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
}
