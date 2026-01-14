type Chunk = {
  id: string;
  text: string;
  embedding: number[];
};

const ragStore = new Map<string, Chunk[]>();

export function saveChunks(siteId: string, chunks: Chunk[]) {
  ragStore.set(siteId, chunks);
}

export function getChunks(siteId: string): Chunk[] {
  return ragStore.get(siteId) || [];
}
