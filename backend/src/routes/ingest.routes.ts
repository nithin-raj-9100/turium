import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import { ingestContent } from '../services/ingest.service';

const router = Router();

const ingestSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('note'),
    content: z
      .string()
      .min(1, 'Content is required')
      .max(50000, 'Content must be at most 50,000 characters'),
  }),
  z.object({
    type: z.literal('url'),
    url: z
      .string()
      .url('Must be a valid URL')
      .refine(
        (url) => url.startsWith('http://') || url.startsWith('https://'),
        'URL must use http or https',
      ),
  }),
]);

router.post('/ingest', validateBody(ingestSchema), async (req, res, next) => {
  try {
    const result = await ingestContent(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
