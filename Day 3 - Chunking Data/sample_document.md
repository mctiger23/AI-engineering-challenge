# Introduction to Vector Databases

## What Is a Vector Database?

A vector database is a specialized type of database designed to store, index, and query high-dimensional vectors — numerical representations of data such as text, images, audio, or video. Unlike traditional relational databases that store structured rows and columns, vector databases are optimized for similarity search: finding items that are "close" to a given query in a mathematical sense.

These databases have become a cornerstone of modern AI applications, particularly those built on top of large language models (LLMs). When a model encodes a piece of text into an embedding — a dense list of floating-point numbers — a vector database stores and retrieves that embedding efficiently.

## How Embeddings Work

An embedding is a fixed-size numerical vector produced by a machine learning model. Words, sentences, or entire documents are passed through an encoder model, which maps them into a continuous vector space. Similar concepts end up near each other in this space.

For example, the sentences "The cat sat on the mat" and "A feline rested on the rug" would produce embeddings with a high cosine similarity score, even though they share no exact words. This semantic understanding is what makes vector search powerful — it goes beyond keyword matching.

Common embedding models include:
- **OpenAI text-embedding-ada-002** — widely used, 1536 dimensions
- **Sentence Transformers** — open-source models from Hugging Face
- **Cohere Embed** — multilingual support with strong performance
- **Google Vertex AI Embeddings** — enterprise-grade, integrated with GCP

## Core Operations

Vector databases support four primary operations:

1. **Insert** — Store a vector alongside its metadata (e.g., source document, timestamp, author).
2. **Query** — Given a query vector, find the top-K most similar vectors using a distance metric.
3. **Update** — Replace or modify an existing vector and its metadata.
4. **Delete** — Remove vectors by ID or metadata filter.

The query operation is the most critical. It relies on Approximate Nearest Neighbor (ANN) algorithms such as HNSW (Hierarchical Navigable Small World) or IVF (Inverted File Index) to return results in milliseconds, even across millions of vectors.

## Popular Vector Databases

Several vector databases have emerged as leaders in the ecosystem:

- **Pinecone** — Fully managed, easy to integrate, popular for production RAG pipelines.
- **Weaviate** — Open-source with a rich GraphQL API and built-in vectorization modules.
- **Qdrant** — Rust-based, high performance, supports payload filtering alongside vector search.
- **Chroma** — Lightweight, developer-friendly, great for local prototyping.
- **pgvector** — A PostgreSQL extension that adds vector similarity search to a familiar relational database.

## Why Chunking Matters

When ingesting long documents into a vector database, you cannot embed the entire document as a single vector — most embedding models have a token limit (e.g., 512 or 8192 tokens). More importantly, a single large embedding loses granularity: a query about a specific section of a document may not surface the right passage.

Chunking solves this by splitting the document into smaller, overlapping segments before embedding. Each chunk is embedded independently and stored as its own vector. During retrieval, the system finds the most relevant chunks rather than the most relevant documents, leading to more precise and useful context for the LLM.

A well-designed chunking strategy balances chunk size (enough context per chunk) and overlap (continuity between adjacent chunks) to maximize retrieval quality.
