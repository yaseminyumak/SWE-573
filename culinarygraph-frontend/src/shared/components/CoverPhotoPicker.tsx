import { useRef, useState } from 'react'

interface Props {
  onChange: (file: File | null) => void
}

export default function CoverPhotoPicker({ onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    onChange(file)
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700">Photos</p>

      {preview ? (
        <div className="relative group rounded-xl overflow-hidden bg-gray-100">
          <img src={preview} alt="cover preview" className="w-full h-64 object-cover" />
          <button
            type="button"
            onClick={() => { onChange(null); setPreview(null); if (fileRef.current) fileRef.current.value = '' }}
            className="absolute top-3 right-3 bg-white bg-opacity-90 text-red-500 rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow border border-red-200 text-base leading-none"
          >
            ×
          </button>
        </div>
      ) : (
        <div className="w-full h-64 rounded-xl bg-gradient-to-br from-[#ede8ee] to-[#d0b0d8] flex flex-col items-center justify-center gap-2">
          <svg className="w-12 h-12 text-[#8c2d9c] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-[#8c2d9c] opacity-50">No photos yet</p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" id="cover-photo-picker" />
        <label htmlFor="cover-photo-picker"
          className="w-16 h-16 rounded-lg border-2 border-dashed border-[#d67ec9] flex flex-col items-center justify-center cursor-pointer hover:bg-[#fdf8ff] transition-colors flex-shrink-0">
          <span className="text-[#8c2d9c] text-xl leading-none">+</span>
          <span className="text-[10px] text-[#8c2d9c] mt-0.5">Photo</span>
        </label>
      </div>
    </div>
  )
}
