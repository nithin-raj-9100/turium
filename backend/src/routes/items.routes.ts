import { Router } from 'express';
import { listItems } from '../db/repositories/items.repository';

const router = Router();

const PREVIEW_LENGTH = 200;

router.get('/items', (_req, res) => {
  const items = listItems().map((item) => ({
    id: item.id,
    source_type: item.source_type,
    title: item.title,
    source_url: item.source_url,
    created_at: item.created_at,
    chunk_count: item.chunk_count,
    preview:
      item.raw_content.length > PREVIEW_LENGTH
        ? `${item.raw_content.slice(0, PREVIEW_LENGTH)}...`
        : item.raw_content,
  }));

  res.json({ items });
});

export default router;
