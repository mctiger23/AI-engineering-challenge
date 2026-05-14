import { z } from "zod";

const provider = z.enum(["openai", "azure", "anthropic", "gemini", "ollama", "compatible"]);

export const AppConfigSchema = z
  .object({
    LLM_PROVIDER: provider,
    EMBEDDING_PROVIDER: provider,

    OPENAI_API_KEY: z.string().optional(),
    OPENAI_BASE_URL: z.string().url().default("https://api.openai.com/v1"),
    OPENAI_CHAT_MODEL: z.string().default("gpt-4o-mini"),
    OPENAI_EMBEDDING_MODEL: z.string().default("text-embedding-3-small"),

    AZURE_OPENAI_API_KEY: z.string().optional(),
    AZURE_OPENAI_RESOURCE_URL: z.string().url().optional(),
    AZURE_OPENAI_API_VERSION: z.string().default("2024-10-21"),
    AZURE_OPENAI_CHAT_DEPLOYMENT: z.string().optional(),
    AZURE_OPENAI_EMBEDDING_DEPLOYMENT: z.string().optional(),

    ANTHROPIC_API_KEY: z.string().optional(),
    ANTHROPIC_BASE_URL: z.string().url().default("https://api.anthropic.com/v1"),
    ANTHROPIC_MODEL: z.string().default("claude-3-5-sonnet-latest"),

    GEMINI_API_KEY: z.string().optional(),
    GEMINI_BASE_URL: z.string().url().default("https://generativelanguage.googleapis.com/v1beta"),
    GEMINI_CHAT_MODEL: z.string().default("gemini-1.5-pro"),
    GEMINI_EMBEDDING_MODEL: z.string().default("text-embedding-004"),

    OLLAMA_BASE_URL: z.string().url().default("http://localhost:11434"),
    OLLAMA_CHAT_MODEL: z.string().default("llama3.1"),
    OLLAMA_EMBEDDING_MODEL: z.string().default("nomic-embed-text"),

    COMPATIBLE_API_KEY: z.string().optional(),
    COMPATIBLE_BASE_URL: z.string().url().optional(),
    COMPATIBLE_CHAT_MODEL: z.string().optional(),
    COMPATIBLE_EMBEDDING_MODEL: z.string().optional(),
  })
  .superRefine((config, ctx) => {
    const requireFields = (condition: boolean, fields: (keyof typeof config)[], message: string) => {
      if (!condition) return;
      for (const field of fields) {
        if (!config[field]) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message });
        }
      }
    };

    requireFields(config.LLM_PROVIDER === "openai" || config.EMBEDDING_PROVIDER === "openai", ["OPENAI_API_KEY"], "OPENAI_API_KEY is required for OpenAI provider.");
    requireFields(config.LLM_PROVIDER === "azure" || config.EMBEDDING_PROVIDER === "azure", ["AZURE_OPENAI_API_KEY", "AZURE_OPENAI_RESOURCE_URL", "AZURE_OPENAI_CHAT_DEPLOYMENT", "AZURE_OPENAI_EMBEDDING_DEPLOYMENT"], "Azure OpenAI configuration is incomplete.");
    requireFields(config.LLM_PROVIDER === "anthropic" || config.EMBEDDING_PROVIDER === "anthropic", ["ANTHROPIC_API_KEY"], "ANTHROPIC_API_KEY is required for Anthropic provider.");
    requireFields(config.LLM_PROVIDER === "gemini" || config.EMBEDDING_PROVIDER === "gemini", ["GEMINI_API_KEY"], "GEMINI_API_KEY is required for Gemini provider.");
    requireFields(config.LLM_PROVIDER === "compatible" || config.EMBEDDING_PROVIDER === "compatible", ["COMPATIBLE_BASE_URL", "COMPATIBLE_CHAT_MODEL", "COMPATIBLE_EMBEDDING_MODEL"], "OpenAI-compatible configuration is incomplete.");
  });

export type AppConfig = z.infer<typeof AppConfigSchema>;

export function parseConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return AppConfigSchema.parse(env);
}
