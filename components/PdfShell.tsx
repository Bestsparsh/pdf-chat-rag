"use client"

import dynamic from "next/dynamic"

const PdfViewer = dynamic(() => import("./PdfViewer"), {
  ssr: false,
})

type Props = {
  file: File | null
  highlight: string
}

export default function PdfShell({ file, highlight }: Props) {
  return <PdfViewer file={file} highlight={highlight} />
}
