import { NextResponse } from "next/server"
import OpenAI from "openai"

export const runtime = "nodejs"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  const { texts } = await req.json()

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  })

  const embeddings = response.data.map((d) => d.embedding)

  return NextResponse.json(embeddings)
}
