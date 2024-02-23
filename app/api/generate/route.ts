import { NextRequest, NextResponse } from "next/server";
import {
  serviceContextFromDefaults,
  SimpleDirectoryReader,
  storageContextFromDefaults,
  VectorStoreIndex,
  ServiceContext,
  OpenAIEmbedding,
  SimpleNodeParser,
  PromptHelper,
  SentenceSplitter,
  MarkdownNodeParser, 
} from "llamaindex";

import * as dotenv from "dotenv";
import {
  CHUNK_OVERLAP,
  CHUNK_SIZE,
  STORAGE_CACHE_DIR,
  STORAGE_DIR,
} from "../chat/engine/constants.mjs";

// Load environment variables from local .env file
dotenv.config();

async function getRuntime(func: { (): Promise<void>; (): any }) {
  const start = Date.now();
  await func();
  const end = Date.now();
  return end - start;
}

async function generateDatasource(serviceContext: ServiceContext) {
  console.log(`Generating storage context...`);
  const ms = await getRuntime(async () => {
    const storageContext = await storageContextFromDefaults({
      persistDir: STORAGE_CACHE_DIR,
    });
    const documents = await new SimpleDirectoryReader().loadData({
      directoryPath: STORAGE_DIR,
    });
    await VectorStoreIndex.fromDocuments(documents, {
      storageContext,
      serviceContext,
    });
  });
  console.log(`Storage context successfully generated in ${ms / 1000}s.`);
}

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const doctype = body.doctype;

  const openaiEmbeds = new OpenAIEmbedding({ model: "text-embedding-3-small" });
  const textSplitter = new SentenceSplitter({ splitLongSentences: true });

  // Initialize the appropriate NodeParser based on `doctype`
  let nodeParser;
  if (doctype === "md") {
    console.log("Using MarkdownNodeParser"); 
    nodeParser = new MarkdownNodeParser();
  } else {
    console.log("Using SimpleNodeParser");
    // Default to SimpleNodeParser if `doctype` is 'txt' or unspecified
    nodeParser = new SimpleNodeParser({
      chunkSize: CHUNK_SIZE,
      chunkOverlap: CHUNK_OVERLAP,
      textSplitter,
    });
  }
  const serviceContext = serviceContextFromDefaults({
    nodeParser,
    embedModel: openaiEmbeds,
  });
  await generateDatasource(serviceContext);
  return NextResponse.json(
    { message: "Storage context successfully generated." },
    { status: 200 }
  );
}
