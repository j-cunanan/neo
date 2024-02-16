import type { NextApiRequest, NextApiResponse } from 'next';
import {
  serviceContextFromDefaults,
  SimpleDirectoryReader,
  storageContextFromDefaults,
  VectorStoreIndex,
  ServiceContext,
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

async function getRuntime(func: { (): Promise<void>; (): any; }) {
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

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const serviceContext = serviceContextFromDefaults({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  });
  await generateDatasource(serviceContext);
  res.status(200).json({ message: 'Storage context successfully generated.' });
}