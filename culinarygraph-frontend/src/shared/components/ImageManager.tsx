import { useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchImages, uploadImage, deleteImage, imageUrl } from '../api/imageApi'

interface Props {
  entityType: string
  entityId: string
  canEdit?: boolean
}

export default function ImageManager({ entityType, entityId, canEdit = false }: Props) {
  const queryClient = useQueryClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)

  const queryKey = ['images', entityType, entityId]
  const { data: images = [] } = useQuery({
    queryKey,
    queryFn: () => fetchImages(entityType, entityId),
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    try {
      await uploadImage(entityType, entityId, file)
      await queryClient.invalidateQueries({ queryKey })
      setActiveIdx(images.length) // select the newly uploaded one
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleDelete = async (id: string, idx: number) => {
    await deleteImage(id)
    await queryClient.invalidateQueries({ queryKey })
    setActiveIdx(Math.max(0, idx - 1))
  }

  const active = images[activeIdx] ?? images[0]

  return (
    <div className="space-y-3">
      {/* Main large image */}
      {active ? (
        <div className="relative group rounded-xl overflow-hidden bg-gray-100">
          <img
            src={imageUrl(active.id)}
            alt={active.filename}
            className="w-full h-80 object-cover"
          />
          {canEdit && (
            <button
              type="button"
              onClick={() => handleDelete(active.id, activeIdx)}
              className="absolute top-3 right-3 bg-white bg-opacity-90 text-red-500 rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow border border-red-200 text-base leading-none"
              aria-label="Delete photo"
            >
              ×
            </button>
          )}
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

      {/* Thumbnails row + upload */}
      <div className="flex items-center gap-2 flex-wrap">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActiveIdx(i)}
            className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
              i === activeIdx ? 'border-[#8c2d9c] shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <img src={imageUrl(img.id)} alt="" className="w-full h-full object-cover" />
          </button>
        ))}

        {canEdit && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id={`img-upload-${entityId}`}
            />
            <label
              htmlFor={`img-upload-${entityId}`}
              className={`w-16 h-16 rounded-lg border-2 border-dashed border-[#d67ec9] flex flex-col items-center justify-center cursor-pointer hover:bg-[#fdf8ff] transition-colors flex-shrink-0 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {uploading ? (
                <span className="text-[10px] text-[#8c2d9c] text-center leading-tight px-1">Uploading…</span>
              ) : (
                <>
                  <span className="text-[#8c2d9c] text-xl leading-none">+</span>
                  <span className="text-[10px] text-[#8c2d9c] mt-0.5">Photo</span>
                </>
              )}
            </label>
          </>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
