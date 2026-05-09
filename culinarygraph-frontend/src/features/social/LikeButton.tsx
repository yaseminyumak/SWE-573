import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../auth/AuthProvider'
import { fetchLikeStatus, toggleLike } from './socialApi'

interface Props {
  entityType: string
  entityId: string
  commentCount?: number
}

export default function LikeButton({ entityType, entityId, commentCount }: Props) {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const { data: status } = useQuery({
    queryKey: ['likes', entityType, entityId],
    queryFn: () => fetchLikeStatus(entityType, entityId),
  })

  const mutation = useMutation({
    mutationFn: () => toggleLike(entityType, entityId),
    onSuccess: (data) => queryClient.setQueryData(['likes', entityType, entityId], data),
  })

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => { if (isAuthenticated) mutation.mutate() }}
        disabled={!isAuthenticated || mutation.isPending}
        title={isAuthenticated ? undefined : 'Log in to like'}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded transition-colors ${
          status?.likedByMe
            ? 'bg-[#8c2d9c] text-white border-[#8c2d9c]'
            : 'border-gray-300 text-gray-600 hover:border-[#8c2d9c] hover:text-[#8c2d9c]'
        } disabled:opacity-50 disabled:cursor-default`}
      >
        ♥ Like
      </button>
      <span className="text-sm text-gray-500">{status?.count ?? 0} {(status?.count ?? 0) === 1 ? 'Like' : 'Likes'}</span>
      {commentCount !== undefined && (
        <span className="text-sm text-gray-500">{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
      )}
    </div>
  )
}
