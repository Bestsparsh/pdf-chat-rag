type Props = {
  onFileSelect: (file: File) => void
}

export default function FileUpload({ onFileSelect }: Props) {
  return (
    <input
      type="file"
      accept="application/pdf"
      onChange={(e) => {
        if (e.target.files?.[0]) {
          onFileSelect(e.target.files[0])
        }
      }}
    />
  )
}
