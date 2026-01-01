import { NextResponse } from "next/server"
import OpenAI from "openai"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  const { question, context } = await req.json()

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini", // cheapest + fast
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. Answer ONLY using the provided context. If the answer is not in the context, say you don't know.",
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion:\n${question}`,
      },
    ],
    temperature: 0.2,
  })

  return NextResponse.json({
    answer: completion.choices[0].message.content,
  })
}
