import { z } from 'zod';
import type { VectorFilter } from '../vector-store/types';

const vectorFilterValueSchema: z.ZodType<VectorFilter[string]> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
  z.array(z.number()),
  z.array(z.boolean()),
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
export const RetrievalSchema = z.object({
  enabled: z.boolean().default(true),
  topK: z.number().int().positive().max(50).default(5),
  filters: VectorFilterSchema.optional(),
});
export const ChatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant', 'tool']),
  content: z.string().min(1),
  name: z.string().optional(),
});
export const ToolDefinitionSchema = z.object({
  type: z.literal('function'),
  function: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    parameters: z.record(z.string(), z.unknown()).optional(),
  }),
});
export const ToolChoiceSchema = z.union([z.literal('auto'), z.literal('none')]);
export const CompletionRequestSchema = z.object({
  prompt: z.string().min(1),
  systemPrompt: z.string().min(1).optional(),
  retrieval: RetrievalSchema.optional(),
  tools: z.array(ToolDefinitionSchema).optional(),
  toolChoice: ToolChoiceSchema.optional(),
});
export const ChatStreamRequestSchema = z.object({
  sessionId: z.string().min(1),
  messages: z.array(ChatMessageSchema).min(1),
  systemPrompt: z.string().min(1).optional(),
  retrieval: RetrievalSchema.optional(),
  tools: z.array(ToolDefinitionSchema).optional(),
  toolChoice: ToolChoiceSchema.optional(),
});
export const EmbeddingsRequestSchema = z.object({ texts: z.array(z.string().min(1)).min(1) });
export const RagIngestRequestSchema = z.object({
  documents: z.array(z.object({
    id: z.string().min(1),
    text: z.string().min(1),
    metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.array(z.string()), z.array(z.number()), z.array(z.boolean()), z.null()])).optional(),
  })).min(1),
});
export const RagSearchRequestSchema = z.object({
  query: z.string().min(1),
  topK: z.number().int().positive().max(50).default(5),
  filters: VectorFilterSchema.optional(),
});
