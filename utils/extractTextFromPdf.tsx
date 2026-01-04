import type { TextItem } from "pdfjs-dist/types/src/display/api"

export async function extractTextFromPdf(file: File) {
  const { pdfjs } = await import("react-pdf")

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise

  const pages: { pageNumber: number; text: string }[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()

    const text = textContent.items
      .filter((item): item is TextItem => "str" in item)
      .map((item) => item.str)
      .join(" ")

    pages.push({
      pageNumber: i,
      text,
    })
  }

  return pages
}
