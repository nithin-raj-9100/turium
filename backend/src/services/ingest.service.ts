import { v4 as uuidv4 } from 'uuid';
import { createChunks } from '../db/repositories/chunks.repository';
import { createItem } from '../db/repositories/items.repository';
import { chunkText } from '../lib/chunker';
import { embedDocuments } from './embedding.service';
import { fetchUrlContent } from './url-fetch.service';

export type IngestType = 'note' | 'url';

export interface IngestNoteInput {
  type: 'note';
  content: string;
}

export interface IngestUrlInput {
  type: 'url';
  url: string;
}

export type IngestInput = IngestNoteInput | IngestUrlInput;

export interface IngestResult {
  id: string;
  source_type: IngestType;
  title: string;
  created_at: string;
  chunk_count: number;
}

function deriveNoteTitle(content: string): string {
  const firstLine = content.split('\n')[0]?.trim() ?? '';
  if (firstLine.length > 0) {
    return firstLine.length > 100 ? `${firstLine.slice(0, 100)}...` : firstLine;
  }
  const preview = content.trim().slice(0, 80);
  return preview.length > 0 ? preview : 'Untitled Note';
}

export async function ingestContent(input: IngestInput): Promise<IngestResult> {
  let title: string;
  let rawContent: string;
  let sourceType: IngestType;
  let sourceUrl: string | null = null;

  if (input.type === 'note') {
    sourceType = 'note';
    rawContent = input.content.trim();
    title = deriveNoteTitle(rawContent);
  } else {
    const fetched = await fetchUrlContent(input.url);
    sourceType = 'url';
    title = fetched.title;
    rawContent = fetched.content;
    sourceUrl = fetched.sourceUrl;
  }

  const itemId = uuidv4();
  const createdAt = new Date().toISOString();

  const item = createItem({
    id: itemId,
    source_type: sourceType,
    title,
    raw_content: rawContent,
    source_url: sourceUrl,
    created_at: createdAt,
  });

  const textChunks = chunkText(rawContent);
  if (textChunks.length === 0) {
    return {
      id: item.id,
      source_type: item.source_type,
      title: item.title,
      created_at: item.created_at,
      chunk_count: 0,
    };
  }

  const embeddings = await embedDocuments(textChunks, title);

  const chunkRecords = textChunks.map((text, index) => ({
    id: uuidv4(),
    item_id: itemId,
    chunk_index: index,
    text,
    embedding: embeddings[index],
    created_at: createdAt,
  }));

  createChunks(chunkRecords);

  return {
    id: item.id,
    source_type: item.source_type,
    title: item.title,
    created_at: item.created_at,
    chunk_count: chunkRecords.length,
  };
}
