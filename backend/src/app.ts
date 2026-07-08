import express from 'express';
import path from 'path';
import pinoHttp from 'pino-http';
import { config } from './config';
import { logger } from './lib/logger';
import { errorHandler } from './middleware/error-handler';
import healthRoutes from './routes/health.routes';
import ingestRoutes from './routes/ingest.routes';
import itemsRoutes from './routes/items.routes';
import queryRoutes from './routes/query.routes';

export function createApp(): express.Application {
  const app = express();

  app.use(
    pinoHttp({
      logger,
      genReqId: (req) =>
        (req.headers['x-request-id'] as string) ?? crypto.randomUUID(),
    }),
  );

  app.use(express.json({ limit: '1mb' }));

  app.use('/api', healthRoutes);
  app.use('/api', ingestRoutes);
  app.use('/api', itemsRoutes);
  app.use('/api', queryRoutes);

  if (config.isProduction) {
    const frontendDist = path.join(__dirname, '../../frontend/dist');
    app.use(express.static(frontendDist));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
  }

  app.use(errorHandler);

  return app;
}
