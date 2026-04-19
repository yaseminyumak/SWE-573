import { useQuery } from '@tanstack/react-query'
import { fetchImages, imageUrl } from '../api/imageApi'

interface Props {
  entityType: string
  entityId: string
}

export default function EntityCardImage({ entityType, entityId }: Props) {
  const { data: images } = useQuery({
    queryKey: ['images', entityType, entityId],
    queryFn: () => fetchImages(entityType, entityId),
    staleTime: 60_000,
  })

  const first = images?.[0]

  if (!first) {
    return (
      <div className="w-full h-44 rounded-t-xl bg-gradient-to-br from-[#ede8ee] to-[#d67ec9] flex items-center justify-center flex-shrink-0">
        <svg className="w-10 h-10 text-white opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={imageUrl(first.id)}
      alt=""
      className="w-full h-44 object-cover rounded-t-xl flex-shrink-0"
    />
  )
}
