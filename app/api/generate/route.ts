import type { NextApiRequest, NextApiResponse } from "next";
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
    const nodeParser = new SimpleNodeParser();
    const nodes = nodeParser.getNodesFromDocuments(documents);
    await VectorStoreIndex.fromDocuments(documents, {
      nodes,
      storageContext,
      serviceContext,
    });
  });
  console.log(`Storage context successfully generated in ${ms / 1000}s.`);
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const openaiEmbeds = new OpenAIEmbedding({ model: "text-embedding-3-small" });
  const textSplitter = new SentenceSplitter({splitLongSentences: true });
  const nodeParser = new SimpleNodeParser({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
    textSplitter,
  });
  const serviceContext = serviceContextFromDefaults({
    nodeParser,
    embedModel: openaiEmbeds,
  });
  await generateDatasource(serviceContext);
  res.status(200).json({ message: "Storage context successfully generated." });
}
