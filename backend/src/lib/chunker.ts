const TARGET_CHUNK_SIZE = 800;
const OVERLAP_SIZE = 150;

function splitAtSentences(text: string, maxSize: number): string[] {
  const chunks: string[] = [];
  let remaining = text.trim();

  while (remaining.length > maxSize) {
    let splitAt = -1;
    const searchRegion = remaining.slice(0, maxSize);

    for (const delimiter of ['. ', '! ', '? ', '\n']) {
      const idx = searchRegion.lastIndexOf(delimiter);
      if (idx > maxSize * 0.3) {
        splitAt = idx + delimiter.length;
        break;
      }
    }

    if (splitAt === -1) {
      splitAt = maxSize;
    }

    chunks.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }

  if (remaining.length > 0) {
    chunks.push(remaining);
  }

  return chunks;
}

function mergeParagraphs(paragraphs: string[]): string[] {
  const merged: string[] = [];
  let current = '';

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    const candidate = current ? `${current}\n\n${trimmed}` : trimmed;

    if (candidate.length <= TARGET_CHUNK_SIZE) {
      current = candidate;
    } else {
      if (current) {
        merged.push(current);
      }
      if (trimmed.length > TARGET_CHUNK_SIZE) {
        merged.push(...splitAtSentences(trimmed, TARGET_CHUNK_SIZE));
        current = '';
      } else {
        current = trimmed;
      }
    }
  }

  if (current) {
    merged.push(current);
  }

  return merged;
}

function applyOverlap(chunks: string[]): string[] {
  if (chunks.length <= 1) return chunks;

  const result: string[] = [chunks[0]];

  for (let i = 1; i < chunks.length; i++) {
    const prev = chunks[i - 1];
    const overlap = prev.slice(-OVERLAP_SIZE);
    const combined = overlap.length > 0 ? `${overlap}\n\n${chunks[i]}` : chunks[i];
    result.push(combined);
  }

  return result;
}

export function chunkText(text: string): string[] {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  if (!normalized) return [];

  const paragraphs = normalized.split(/\n\n+/);
  const merged = mergeParagraphs(paragraphs);

  if (merged.length === 0) {
    return splitAtSentences(normalized, TARGET_CHUNK_SIZE);
  }

  return applyOverlap(merged);
}
