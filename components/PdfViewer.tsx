"use client"

import { Document, Page, pdfjs } from "react-pdf"
import { FixedSizeList as List } from "react-window"
import { useState } from "react"
import { highlightText } from "@/utils"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`

export default function PdfViewer({
  file,
  highlight,
}: {
  file: File | null
  highlight: string
}) {
  const [numPages, setNumPages] = useState(0)

  const customTextRenderer = ({ str }: { str: string }) => {
    return highlight ? highlightText(str, highlight) : str
  }

  return (
    <Document
      file={file}
      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
    >
      <div className="h-full overflow-hidden">
        <List
          height={window.innerHeight}
          itemCount={numPages}
          itemSize={792}
          width={630}
          className="bg-white no-scrollbar"
        >
          {(props: unknown) => {
            const { index, style } = props as {
              index: number
              style: React.CSSProperties
            }

            return (
              <div style={style}>
                <Page
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  customTextRenderer={customTextRenderer}
                />
              </div>
            )
          }}
        </List>
      </div>
    </Document>
  )
}
