import { getDb } from '../index';
import {
  CreateItemInput,
  Item,
  ItemWithChunkCount,
} from '../types';

export function createItem(input: CreateItemInput): Item {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO items (id, source_type, title, raw_content, source_url, created_at)
    VALUES (@id, @source_type, @title, @raw_content, @source_url, @created_at)
  `);

  stmt.run({
    ...input,
    source_url: input.source_url ?? null,
  });

  return getItemById(input.id)!;
}

export function getItemById(id: string): Item | null {
  const db = getDb();
  return db.prepare('SELECT * FROM items WHERE id = ?').get(id) as Item | null;
}

export function listItems(): ItemWithChunkCount[] {
  const db = getDb();
  return db
    .prepare(
      `
    SELECT
      i.*,
      COUNT(c.id) AS chunk_count
    FROM items i
    LEFT JOIN chunks c ON c.item_id = i.id
    GROUP BY i.id
    ORDER BY i.created_at DESC
  `,
    )
    .all() as ItemWithChunkCount[];
}

export function countItems(): number {
  const db = getDb();
  const row = db.prepare('SELECT COUNT(*) AS count FROM items').get() as {
    count: number;
  };
  return row.count;
}
