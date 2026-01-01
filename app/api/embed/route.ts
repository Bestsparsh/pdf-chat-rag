import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const { texts } = await req.json()

  const embeddings = await Promise.all(
    texts.map(async (text: string) => {
      const res = await fetch("http://localhost:11434/api/embeddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "nomic-embed-text",
          prompt: text,
        }),
      })

      const data = await res.json()
      return data.embedding
    })
  )

  return NextResponse.json(embeddings)
}
