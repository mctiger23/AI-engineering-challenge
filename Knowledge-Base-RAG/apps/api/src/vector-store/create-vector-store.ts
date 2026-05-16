import { ChromaClient, type ChromaClientArgs } from 'chromadb';
import type { AppConfig } from '../config/env';
import { ChromaAdapter } from './chroma.adapter';

export const toChromaClientArgs = (url: string): Pick<ChromaClientArgs, 'host' | 'port' | 'ssl'> => {
  const parsed = new URL(url);
  const ssl = parsed.protocol === 'https:';
  const port = parsed.port ? Number(parsed.port) : ssl ? 443 : 80;

  return {
    host: parsed.hostname,
    port,
    ssl,
  };
};

export const createVectorStore = (config: AppConfig): ChromaAdapter =>
  new ChromaAdapter(new ChromaClient(toChromaClientArgs(config.CHROMA_URL)), config.CHROMA_COLLECTION);
