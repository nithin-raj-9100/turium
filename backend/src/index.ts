import fs from 'fs';
import path from 'path';
import { config, validateConfig } from './config';
import { createApp } from './app';
import { initDatabase } from './db';
import { logger } from './lib/logger';

function ensureDataDir(): void {
  const dir = path.dirname(path.resolve(config.databasePath));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function main(): void {
  validateConfig();
  ensureDataDir();
  initDatabase();

  const app = createApp();

  app.listen(config.port, () => {
    logger.info(
      { port: config.port, env: config.nodeEnv },
      'Server started',
    );
  });
}

main();
