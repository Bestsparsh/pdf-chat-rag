"use client"

import { useState, memo } from "react"
import { FileUpload, ChatPanel, PdfShell } from "@/components"
import { chunkText, extractTextFromPdf, rankChunks } from "@/utils"

const MemoPdfShell = memo(PdfShell)

export default function Home() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [highlight, setHighlight] = useState<string>("")

  const [vectorStore, setVectorStore] = useState<
    { text: string; embedding: number[] }[]
  >([])

  async function generateAnswer(question: string, context: string) {
    const res = await fetch("/api/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, context }),
    })

    const data = await res.json()
    return data.answer
  }

  const handleAsk = async () => {
    if (!question || vectorStore.length === 0) return

    setLoading(true)

    const [queryEmbedding] = await embed(question)

    const relevantChunks = rankChunks(queryEmbedding, vectorStore)

    const context = relevantChunks.map((c) => c.text).join("\n")

    const answer = await generateAnswer(question, context)

    setAnswer(answer)
    setLoading(false)
  }

  const handleFileUpload = async (file: File) => {
    setPdfFile(file)

    const extracted = await extractTextFromPdf(file)
    const chunks = extracted.flatMap((p) => chunkText(p.text))

    const embeddings = await embed(chunks)

    const vectors = chunks.map((text, i) => ({
      text,
      embedding: embeddings[i],
    }))

    setVectorStore(vectors)
  }

  return (
    <main className="h-screen flex flex-col">
      <div className="p-4 border-b">
        <FileUpload onFileSelect={handleFileUpload} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[630px] border-r overflow-hidden">
          <MemoPdfShell file={pdfFile} highlight={highlight} />
        </div>

        <div className="w-[calc(100%-630px)]">
          <ChatPanel
            question={question}
            setQuestion={setQuestion}
            answer={answer}
            loading={loading}
            onAsk={handleAsk}
          />
        </div>
      </div>
    </main>
  )
}

async function embed(texts: string | string[]) {
  const textsArray = Array.isArray(texts) ? texts : [texts]

  const res = await fetch("/api/embed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texts: textsArray }),
  })

  if (!res.ok) throw new Error("Failed to generate embeddings")

  const vectors: number[][] = await res.json()
  return vectors
}
