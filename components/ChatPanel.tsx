type ChatPanelProps = {
  question: string
  setQuestion: (q: string) => void
  answer: string
  loading: boolean
  onAsk: () => void
}

export default function ChatPanel({
  question,
  setQuestion,
  answer,
  loading,
  onAsk,
}: ChatPanelProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 p-4 overflow-auto space-y-3">
        {answer ? (
          <div className="bg-gray-100 rounded p-3 text-sm text-gray-900 whitespace-pre-wrap">
            {answer}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">
            Ask a question about the document…
          </p>
        )}
      </div>

      <div className="border-t p-3">
        <textarea
          rows={3}
          placeholder="Ask something about this PDF…"
          className="w-full resize-none border rounded px-3 py-2 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button
          onClick={onAsk}
          disabled={!question || loading}
          className="mt-2 w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>
    </div>
  )
}
