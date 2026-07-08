import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import { AppError } from '../middleware/error-handler';
import { logger } from '../lib/logger';

export interface FetchedContent {
  title: string;
  content: string;
  sourceUrl: string;
}

export async function fetchUrlContent(url: string): Promise<FetchedContent> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; KnowledgeInbox/1.0; +https://github.com/knowledge-inbox)',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new AppError(
        422,
        'URL_FETCH_FAILED',
        `Failed to fetch URL: HTTP ${response.status}`,
      );
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
      throw new AppError(
        422,
        'URL_FETCH_FAILED',
        'URL did not return HTML content',
      );
    }

    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article || !article.textContent?.trim()) {
      throw new AppError(
        422,
        'URL_FETCH_FAILED',
        'Could not extract readable content from URL',
      );
    }

    const title =
      article.title?.trim() ||
      dom.window.document.title?.trim() ||
      new URL(url).hostname;

    return {
      title,
      content: article.textContent.trim(),
      sourceUrl: url,
    };
  } catch (err) {
    if (err instanceof AppError) throw err;
    logger.error({ err, url }, 'URL fetch failure');
    throw new AppError(
      422,
      'URL_FETCH_FAILED',
      `Failed to fetch or parse URL: ${err instanceof Error ? err.message : 'unknown error'}`,
    );
  }
}
