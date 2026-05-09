import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useAuth } from '../../auth/AuthProvider'
import { fetchComments, addComment, deleteComment } from './socialApi'

interface Props {
  entityType: string
  entityId: string
  onCommentCountChange?: (count: number) => void
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

export default function CommentSection({ entityType, entityId, onCommentCountChange }: Props) {
  const { isAuthenticated, keycloak } = useAuth()
  const queryClient = useQueryClient()
  const [body, setBody] = useState('')

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', entityType, entityId],
    queryFn: () => fetchComments(entityType, entityId),
    select: (data) => {
      onCommentCountChange?.(data.length)
      return data
    },
  })

  const addMutation = useMutation({
    mutationFn: () => addComment(entityType, entityId, body.trim()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', entityType, entityId] })
      setBody('')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', entityType, entityId] }),
  })

  const currentUsername = keycloak.tokenParsed?.preferred_username

  return (
    <div className="mt-8 border-t border-gray-100 pt-6">
      <h2 className="text-base font-bold text-[#171433] mb-4">Comments</h2>

      {comments.length > 0 ? (
        <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 bg-white shadow-sm mb-6">
          {comments.map((c) => (
            <div key={c.id} className="px-4 py-3">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#171433]">{c.username}</span>
                  <span className="text-xs text-gray-400">{timeAgo(c.createdAt)}</span>
                </div>
                {isAuthenticated && c.username === currentUsername && (
                  <button
                    onClick={() => deleteMutation.mutate(c.id)}
                    disabled={deleteMutation.isPending}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 mb-6">No comments yet.</p>
      )}

      {isAuthenticated ? (
        <div className="border border-gray-200 rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-[#171433] mb-2">Add a Comment</p>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Write your comment..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#8c2d9c]"
          />
          <button
            onClick={() => { if (body.trim()) addMutation.mutate() }}
            disabled={!body.trim() || addMutation.isPending}
            className="mt-2 px-4 py-1.5 text-sm font-medium bg-[#8c2d9c] text-white rounded hover:bg-[#7a2589] transition-colors disabled:opacity-50"
          >
            Post Comment
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic">Log in to leave a comment.</p>
      )}
    </div>
  )
}
