"use client"

import { useEffect, useState } from "react"
import { FixedSizeList as List } from "react-window"
import { highlightText } from "@/utils"

/* eslint-disable @typescript-eslint/no-explicit-any */

type PdfModule = {
  Document: React.ComponentType<any>
  Page: React.ComponentType<any>
  pdfjs: {
    GlobalWorkerOptions: {
      workerSrc: string
    }
  }
}

export default function PdfViewer({
  file,
  highlight,
}: {
  file: File | null
  highlight: string
}) {
  const [pdf, setPdf] = useState<PdfModule | null>(null)
  const [numPages, setNumPages] = useState<number>(0)

  useEffect(() => {
    let mounted = true

    import("react-pdf").then((mod) => {
      if (!mounted) return

      mod.pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"

      setPdf({
        Document: mod.Document,
        Page: mod.Page,
        pdfjs: mod.pdfjs,
      })
    })

    return () => {
      mounted = false
    }
  }, [])

  if (!pdf || !file) return null

  const { Document, Page } = pdf

  return (
    <Document
      file={file}
      onLoadSuccess={(doc: { numPages: number }) => setNumPages(doc.numPages)}
    >
      <List
        height={window.innerHeight}
        itemCount={numPages}
        itemSize={792}
        width={630}
        className="bg-white no-scrollbar"
      >
        {({ index, style }) => (
          <div style={style}>
            <Page
              pageNumber={index + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              customTextRenderer={(item: { str: string }) =>
                highlight ? highlightText(item.str, highlight) : item.str
              }
            />
          </div>
        )}
      </List>
    </Document>
  )
}
