import fs from 'fs';
import path from 'path';
import { config } from './config';
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
  ensureDataDir();
  initDatabase();

  const app = createApp();
  const host = '0.0.0.0';

  app.listen(config.port, host, () => {
    logger.info(
      { port: config.port, host, env: config.nodeEnv },
      'Server started',
    );
  });
}

main();
