import cors from 'cors';
import express from 'express';
import type { AppConfig } from '../config/env';
import type { OllamaAdapter } from '../llm/ollama.adapter';
import type { RagPipeline } from '../rag/pipeline';
import type { VectorStoreAdapter } from '../vector-store/types';
import { createRouter } from './routes';

export const createApp = ({
  config,
  ollama,
  ragPipeline,
  vectorStore,
}: {
  config: AppConfig;
  ollama: OllamaAdapter;
  ragPipeline: RagPipeline;
  vectorStore: VectorStoreAdapter;
}) => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(createRouter({ ragPipeline, ollama, vectorStore }));
  return { app, port: config.API_PORT };
};
