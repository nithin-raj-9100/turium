import { getDb } from '../index';
import { Chunk, ChunkWithItem, CreateChunkInput } from '../types';

export function createChunks(inputs: CreateChunkInput[]): void {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO chunks (id, item_id, chunk_index, text, embedding, created_at)
    VALUES (@id, @item_id, @chunk_index, @text, @embedding, @created_at)
  `);

  const insertMany = db.transaction((chunks: CreateChunkInput[]) => {
    for (const chunk of chunks) {
      stmt.run({
        ...chunk,
        embedding: JSON.stringify(chunk.embedding),
      });
    }
  });

  insertMany(inputs);
}

export function getAllChunksWithItems(): ChunkWithItem[] {
  const db = getDb();
  const rows = db
    .prepare(
      `
    SELECT
      c.id,
      c.item_id,
      c.chunk_index,
      c.text,
      c.embedding,
      c.created_at,
      i.title AS item_title,
      i.source_url AS item_source_url
    FROM chunks c
    JOIN items i ON i.id = c.item_id
    ORDER BY c.created_at DESC
  `,
    )
    .all() as Array<
    Omit<Chunk, 'embedding'> & {
      embedding: string;
      item_title: string;
      item_source_url: string | null;
    }
  >;

  return rows.map((row) => ({
    id: row.id,
    item_id: row.item_id,
    chunk_index: row.chunk_index,
    text: row.text,
    embedding: JSON.parse(row.embedding) as number[],
    created_at: row.created_at,
    item_title: row.item_title,
    item_source_url: row.item_source_url,
  }));
}

export function getChunkCountByItemId(itemId: string): number {
  const db = getDb();
  const row = db
    .prepare('SELECT COUNT(*) AS count FROM chunks WHERE item_id = ?')
    .get(itemId) as { count: number };
  return row.count;
}
