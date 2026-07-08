export type SourceType = 'note' | 'url';

export interface Item {
  id: string;
  source_type: SourceType;
  title: string;
  raw_content: string;
  source_url: string | null;
  created_at: string;
}

export interface ItemWithChunkCount extends Item {
  chunk_count: number;
}

export interface CreateItemInput {
  id: string;
  source_type: SourceType;
  title: string;
  raw_content: string;
  source_url?: string | null;
  created_at: string;
}

export interface Chunk {
  id: string;
  item_id: string;
  chunk_index: number;
  text: string;
  embedding: number[];
  created_at: string;
}

export interface CreateChunkInput {
  id: string;
  item_id: string;
  chunk_index: number;
  text: string;
  embedding: number[];
  created_at: string;
}

export interface ChunkWithItem extends Chunk {
  item_title: string;
  item_source_url: string | null;
}
