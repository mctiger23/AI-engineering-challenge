import { z } from 'zod';

const EnvSchema = z.object({
  API_PORT: z.coerce.number().int().positive().default(4000),
  OLLAMA_BASE_URL: z.string().url().default('http://localhost:11434'),
  OLLAMA_CHAT_MODEL: z.string().default('qwen3:8b '), //('gpt-oss:20b'),
  OLLAMA_EMBEDDING_MODEL: z.string().default('nomic-embed-text:latest'),
  CHROMA_URL: z.string().url().default('http://localhost:8000'),
  CHROMA_COLLECTION: z.string().default('knowledge_base'),
});

export type AppConfig = z.infer<typeof EnvSchema>;

export const parseConfig = (env: NodeJS.ProcessEnv = process.env): AppConfig => EnvSchema.parse(env);
