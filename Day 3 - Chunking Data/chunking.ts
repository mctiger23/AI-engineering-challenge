import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { MarkdownTextSplitter } from "@langchain/textsplitters";

const __dirname = dirname(fileURLToPath(import.meta.url));

function log(message: string): void {
  console.log(`[${new Date().toISOString()}] [INFO] ${message}`);
}

function loadMarkdown(filepath: string): string {
  return readFileSync(filepath, "utf-8");
}

async function main(): Promise<void> {
  const filePath = join(__dirname, "sample_document.md");

  log(`Loading document: ${filePath}`);
  const text = loadMarkdown(filePath);
  log(`Document loaded — total characters: ${text.length}`);

  const chunkSize = 300;
  const chunkOverlap = 50;
  log(`Splitting with LangChain MarkdownTextSplitter — chunkSize=${chunkSize}, chunkOverlap=${chunkOverlap} ...`);

  const splitter = new MarkdownTextSplitter({ chunkSize, chunkOverlap });
  const docs = await splitter.createDocuments([text]);

  log(`Total chunks produced: ${docs.length}`);
  log("─".repeat(60));

  docs.forEach((doc, index) => {
    const preview = doc.pageContent.replace(/\n/g, " ").slice(0, 80);
    log(`Chunk #${index} | chars: ${doc.pageContent.length} | "${preview}..."`);
  });

  log("─".repeat(60));
  log("Chunking complete.");
}

main();
