import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchHeritage, deleteHeritage } from '../catalog/catalogApi'
import ConfirmModal from '../../shared/components/ConfirmModal'
import { useAuth } from '../../auth/AuthProvider'
import LikeButton from '../social/LikeButton'
import CommentSection from '../social/CommentSection'

export default function HeritageDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, keycloak } = useAuth()
  const queryClient = useQueryClient()
  const [showConfirm, setShowConfirm] = useState(false)
  const [commentCount, setCommentCount] = useState(0)

  const { data: heritage, isLoading, error } = useQuery({
    queryKey: ['heritage', id],
    queryFn: () => fetchHeritage(id!),
    enabled: !!id,
  })

  const delMutation = useMutation({
    mutationFn: () => deleteHeritage(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heritage'] })
      navigate('/heritage')
    },
  })

  if (!id) return null
  if (isLoading) return <p className="text-center py-16 text-sm text-gray-400">Loading…</p>
  if (error || !heritage) return <p className="text-center py-16 text-sm text-red-500">Heritage not found.</p>

  const canEdit = isAuthenticated && heritage.createdBy === keycloak.tokenParsed?.preferred_username

  return (
    <>
      {showConfirm && (
        <ConfirmModal
          label={heritage.name}
          onConfirm={() => delMutation.mutate()}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Title + actions */}
        <div className="mb-2">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-[#171433]">{heritage.name}</h1>
            {canEdit && (
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => navigate(`/heritage/${id}/edit`)}
                  className="px-3 py-1.5 text-sm font-medium border border-[#8c2d9c] text-[#8c2d9c] rounded hover:bg-[#ede8ee] transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="px-3 py-1.5 text-sm font-medium border border-red-300 text-red-500 rounded hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          <div className="mt-2">
            <span className="text-xs bg-[#ede8ee] text-[#8c2d9c] px-3 py-1 rounded-full font-medium">
              {heritage.country}
            </span>
          </div>
        </div>

        <hr className="border-[#d67ec9] my-6" />

        <div className="space-y-6">
          <div>
            <p className="font-bold text-sm text-[#171433] mb-1">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed border-l-2 border-[#d67ec9] pl-3 whitespace-pre-wrap">
              {heritage.description}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <LikeButton entityType="HERITAGE" entityId={heritage.id} commentCount={commentCount} />
          </div>

          <CommentSection entityType="HERITAGE" entityId={heritage.id} onCommentCountChange={setCommentCount} />

          {heritage.createdBy && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Created by{' '}
                <Link
                  to={`/profile/${heritage.createdBy}`}
                  className="font-medium text-[#8c2d9c] hover:underline"
                >
                  {heritage.createdBy}
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
