export type VectorMetadataValue = string | number | boolean;

export type VectorMetadata = Record<string, VectorMetadataValue | VectorMetadataValue[] | null>;

export type VectorFilterValue =
  | VectorMetadataValue
  | VectorMetadataValue[]
  | {
      eq?: VectorMetadataValue;
      in?: VectorMetadataValue[];
      gt?: number;
      gte?: number;
      lt?: number;
      lte?: number;
    };

export type VectorFilter = Record<string, VectorFilterValue>;

export interface VectorDocument {
  id: string;
  vector: number[];
  metadata?: VectorMetadata;
  content?: string;
}

export interface VectorQueryMatch {
  id: string;
  score: number;
  metadata?: VectorMetadata;
  content?: string;
}

export interface VectorQueryResult {
  matches: VectorQueryMatch[];
}

export interface VectorStoreAdapter {
  upsert(documents: VectorDocument[]): Promise<void>;
  query(vector: number[], topK: number, filter?: VectorFilter): Promise<VectorQueryResult>;
  delete(ids: string[]): Promise<void>;
}
