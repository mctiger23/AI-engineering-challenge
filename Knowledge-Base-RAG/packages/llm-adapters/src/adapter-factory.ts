import { parseConfig } from "@kbrag/shared";
import { AnthropicAdapter } from "./anthropic.adapter";
import { AzureOpenAIAdapter } from "./azure-openai.adapter";
import { GeminiAdapter } from "./gemini.adapter";
import { EmbeddingAdapter, LLMChatAdapter } from "./interfaces";
import { OllamaAdapter } from "./ollama.adapter";
import { OpenAIAdapter } from "./openai.adapter";
import { OpenAICompatibleAdapter } from "./openai-compatible.adapter";

export function createChatAdapter(env: NodeJS.ProcessEnv = process.env): LLMChatAdapter {
  const config = parseConfig(env);

  switch (config.LLM_PROVIDER) {
    case "openai":
      return new OpenAIAdapter(
        config.OPENAI_API_KEY!,
        config.OPENAI_BASE_URL,
        config.OPENAI_CHAT_MODEL,
        config.OPENAI_EMBEDDING_MODEL,
      );
    case "azure":
      return new AzureOpenAIAdapter(
        config.AZURE_OPENAI_API_KEY!,
        config.AZURE_OPENAI_RESOURCE_URL!,
        config.AZURE_OPENAI_API_VERSION,
        config.AZURE_OPENAI_CHAT_DEPLOYMENT!,
        config.AZURE_OPENAI_EMBEDDING_DEPLOYMENT!,
      );
    case "anthropic":
      return new AnthropicAdapter(config.ANTHROPIC_API_KEY!, config.ANTHROPIC_BASE_URL, config.ANTHROPIC_MODEL);
    case "gemini":
      return new GeminiAdapter(config.GEMINI_API_KEY!, config.GEMINI_BASE_URL, config.GEMINI_CHAT_MODEL, config.GEMINI_EMBEDDING_MODEL);
    case "ollama":
      return new OllamaAdapter(config.OLLAMA_BASE_URL, config.OLLAMA_CHAT_MODEL, config.OLLAMA_EMBEDDING_MODEL);
    case "compatible":
      return new OpenAICompatibleAdapter(
        config.COMPATIBLE_API_KEY ?? "",
        config.COMPATIBLE_BASE_URL!,
        config.COMPATIBLE_CHAT_MODEL!,
        config.COMPATIBLE_EMBEDDING_MODEL!,
      );
  }
}

export function createEmbeddingAdapter(env: NodeJS.ProcessEnv = process.env): EmbeddingAdapter {
  const config = parseConfig(env);

  switch (config.EMBEDDING_PROVIDER) {
    case "openai":
      return new OpenAIAdapter(
        config.OPENAI_API_KEY!,
        config.OPENAI_BASE_URL,
        config.OPENAI_CHAT_MODEL,
        config.OPENAI_EMBEDDING_MODEL,
      );
    case "azure":
      return new AzureOpenAIAdapter(
        config.AZURE_OPENAI_API_KEY!,
        config.AZURE_OPENAI_RESOURCE_URL!,
        config.AZURE_OPENAI_API_VERSION,
        config.AZURE_OPENAI_CHAT_DEPLOYMENT!,
        config.AZURE_OPENAI_EMBEDDING_DEPLOYMENT!,
      );
    case "anthropic":
      return new AnthropicAdapter(config.ANTHROPIC_API_KEY!, config.ANTHROPIC_BASE_URL, config.ANTHROPIC_MODEL);
    case "gemini":
      return new GeminiAdapter(config.GEMINI_API_KEY!, config.GEMINI_BASE_URL, config.GEMINI_CHAT_MODEL, config.GEMINI_EMBEDDING_MODEL);
    case "ollama":
      return new OllamaAdapter(config.OLLAMA_BASE_URL, config.OLLAMA_CHAT_MODEL, config.OLLAMA_EMBEDDING_MODEL);
    case "compatible":
      return new OpenAICompatibleAdapter(
        config.COMPATIBLE_API_KEY ?? "",
        config.COMPATIBLE_BASE_URL!,
        config.COMPATIBLE_CHAT_MODEL!,
        config.COMPATIBLE_EMBEDDING_MODEL!,
      );
  }
}
