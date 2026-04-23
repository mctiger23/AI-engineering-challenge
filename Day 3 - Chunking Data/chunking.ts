import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface Chunk {
  chunkIndex: number;
  text: string;
  charStart: number;
  charEnd: number;
}

function log(message: string): void {
  console.log(`[${new Date().toISOString()}] [INFO] ${message}`);
}

function loadMarkdown(filepath: string): string {
  return readFileSync(filepath, "utf-8");
}

function chunkText(
  text: string,
  chunkSize: number = 300,
  chunkOverlap: number = 50
): Chunk[] {
  if (chunkSize <= 0) throw new Error("chunkSize must be greater than 0");
  if (chunkOverlap < 0) throw new Error("chunkOverlap must be non-negative");
  if (chunkOverlap >= chunkSize)
    throw new Error("chunkOverlap must be less than chunkSize");

  const chunks: Chunk[] = [];
  const step = chunkSize - chunkOverlap;
  let index = 0;

  for (let start = 0; start < text.length; start += step) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push({
      chunkIndex: index++,
      text: text.slice(start, end),
      charStart: start,
      charEnd: end,
    });
    if (end === text.length) break;
  }

  return chunks;
}

function main(): void {
  const filePath = join(__dirname, "sample_document.md");

  log(`Loading document: ${filePath}`);
  const text = loadMarkdown(filePath);
  log(`Document loaded — total characters: ${text.length}`);

  const chunkSize = 300;
  const chunkOverlap = 50;
  log(
    `Chunking with chunkSize=${chunkSize}, chunkOverlap=${chunkOverlap} ...`
  );

  const chunks = chunkText(text, chunkSize, chunkOverlap);
  log(`Total chunks produced: ${chunks.length}`);
  log("─".repeat(60));

  for (const chunk of chunks) {
    const preview = chunk.text.replace(/\n/g, " ").slice(0, 80);
    log(
      `Chunk #${chunk.chunkIndex} | chars [${chunk.charStart}–${chunk.charEnd}] | "${preview}..."`
    );
  }

  log("─".repeat(60));
  log("Chunking complete.");
}

main();
