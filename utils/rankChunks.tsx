export function cosineSimilarity(a: number[], b: number[]) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const normA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0))
  const normB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0))
  return dot / (normA * normB)
}

export function rankChunks(
  queryEmbedding: number[],
  vectors: { text: string; embedding: number[] }[],
  topK = 4
) {
  return vectors
    .map((v) => ({
      text: v.text,
      score: cosineSimilarity(queryEmbedding, v.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
}
