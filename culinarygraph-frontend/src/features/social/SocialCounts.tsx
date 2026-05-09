import { useQuery } from '@tanstack/react-query'
import { fetchLikeStatus, fetchComments } from './socialApi'

interface Props {
  entityType: string
  entityId: string
}

export default function SocialCounts({ entityType, entityId }: Props) {
  const { data: likes } = useQuery({
    queryKey: ['likes', entityType, entityId],
    queryFn: () => fetchLikeStatus(entityType, entityId),
  })
  const { data: comments } = useQuery({
    queryKey: ['comments', entityType, entityId],
    queryFn: () => fetchComments(entityType, entityId),
  })

  const likeCount = likes?.count ?? 0
  const commentCount = comments?.length ?? 0

  if (likeCount === 0 && commentCount === 0) return null

  return (
    <div className="flex items-center gap-3 mt-1">
      {likeCount > 0 && (
        <span className="text-xs text-gray-400">♥ {likeCount}</span>
      )}
      {commentCount > 0 && (
        <span className="text-xs text-gray-400">💬 {commentCount}</span>
      )}
    </div>
  )
}
