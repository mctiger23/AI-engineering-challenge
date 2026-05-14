import type { VectorStoreAdapter } from './types';

type Provider = 'chroma' | 'pinecone' | 'qdrant' | 'pgvector' | 'supabase';

export function createVectorStoreAdapter(adapters: Record<Provider, VectorStoreAdapter>): VectorStoreAdapter {
  const provider = (process.env.VECTOR_DB_PROVIDER ?? 'chroma').toLowerCase() as Provider;
  const adapter = adapters[provider];

  if (!adapter) {
    throw new Error(`Unsupported vector store provider: ${provider}`);
  }

  return adapter;
}
