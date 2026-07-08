import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import { queryKnowledge } from '../services/rag.service';

const router = Router();

const querySchema = z.object({
  question: z.string().min(1, 'Question is required'),
  top_k: z.number().int().min(1).max(20).optional(),
});

router.post('/query', validateBody(querySchema), async (req, res, next) => {
  try {
    const result = await queryKnowledge(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
