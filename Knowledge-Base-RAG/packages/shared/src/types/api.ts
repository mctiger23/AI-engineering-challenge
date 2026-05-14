import { z } from 'zod';
import { VectorFilter } from './vector';

const vectorFilterValueSchema: z.ZodType<VectorFilter[string]> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.union([z.string(), z.number(), z.boolean()])),
  z.object({
    eq: z.union([z.string(), z.number(), z.boolean()]).optional(),
    in: z.array(z.union([z.string(), z.number(), z.boolean()])).optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    lt: z.number().optional(),
    lte: z.number().optional(),
  }),
]);

export const VectorFilterSchema: z.ZodType<VectorFilter> = z.record(z.string(), vectorFilterValueSchema);

export const ChatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant', 'tool']),
  content: z.string().min(1),
  name: z.string().optional(),
});

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1),
  sessionId: z.string().min(1),
  retrieval: z
    .object({
      enabled: z.boolean().default(true),
      topK: z.number().int().positive().max(50).default(5),
      filters: VectorFilterSchema.optional(),
    })
    .optional(),
});

export const EmbeddingsRequestSchema = z.object({ texts: z.array(z.string().min(1)).min(1) });

export const RagIngestRequestSchema = z.object({
  documents: z.array(z.object({ id: z.string().min(1), text: z.string().min(1), metadata: z.record(z.string(), z.unknown()).optional() })).min(1),
});

export const RagSearchRequestSchema = z.object({
  query: z.string().min(1),
  topK: z.number().int().positive().max(50).default(5),
  filters: VectorFilterSchema.optional(),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type EmbeddingsRequest = z.infer<typeof EmbeddingsRequestSchema>;
export type RagIngestRequest = z.infer<typeof RagIngestRequestSchema>;
export type RagSearchRequest = z.infer<typeof RagSearchRequestSchema>;
