import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronDownIcon } from 'lucide-react';
import { QuerySource } from '@/api/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface AnswerCardProps {
  answer: string;
  sources: QuerySource[];
}

const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="mb-3 flex list-disc flex-col gap-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 flex list-decimal flex-col gap-1 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent-foreground underline-offset-4 hover:underline"
    >
      {children}
    </a>
  ),
};

export function AnswerCard({ answer, sources }: AnswerCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Answer
        </h3>
        <div className="rounded-lg bg-accent p-4 text-sm leading-relaxed text-foreground">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {answer}
          </ReactMarkdown>
        </div>
      </div>

      {sources.length > 0 && (
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger render={<Button variant="ghost" className="h-8 px-2" />}>
            <ChevronDownIcon
              data-icon="inline-start"
              className={open ? 'rotate-180 transition-transform' : 'transition-transform'}
            />
            {open ? 'Hide' : 'Show'} {sources.length} source
            {sources.length !== 1 ? 's' : ''}
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-3 flex flex-col gap-2">
            {sources.map((source, idx) => (
              <Card key={`${source.item_id}-${idx}`} size="sm" className="bg-muted/40 shadow-none ring-0">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="truncate text-sm">{source.title}</CardTitle>
                    <Badge variant="outline">{source.score.toFixed(2)}</Badge>
                  </div>
                  <CardDescription>{source.snippet}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
