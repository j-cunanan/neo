export const STORAGE_DIR = "./data";
export const STORAGE_CACHE_DIR = "./cache";
export const DATASOURCES_CHUNK_SIZE = 512;
export const DATASOURCES_CHUNK_OVERLAP = 20;


export const DOCUMENT_FILE_SIZE_LIMIT = 1024 * 1024 * 10; // 10 MB

export const DOCUMENT_TYPES = [
  "text/html",
  "application/pdf",
  "text/plain",
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;

export type ImageType = (typeof IMAGE_TYPES)[number];
