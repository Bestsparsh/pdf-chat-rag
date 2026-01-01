export function highlightText(text: string, highlight: string) {
  if (!highlight) return text

  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const regex = new RegExp(`(${escaped})`, "gi")

  return text.replace(regex, `<mark class="bg-yellow-300">$1</mark>`)
}
