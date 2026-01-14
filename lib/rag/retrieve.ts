import { embedText } from "./embeddings";
import { cosineSimilarity } from "./similarity";
import { getChunks } from "./store";

export async function retrieveRelevantChunks(
  siteId: string,
  question: string,
  topK = 6
) {
  const questionEmbedding = await embedText(question);
  const chunks = getChunks(siteId);

  const scored = chunks.map((chunk) => ({
    ...chunk,
    score: cosineSimilarity(questionEmbedding, chunk.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}
