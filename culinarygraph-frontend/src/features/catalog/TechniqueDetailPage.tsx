import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchTechnique, deleteTechnique } from './catalogApi'
import EntityCardImage from '../../shared/components/EntityCardImage'
import ConfirmModal from '../../shared/components/ConfirmModal'
import { useCatalogIndex } from '../../shared/hooks/useCatalogIndex'
import { useAuth } from '../../auth/AuthProvider'
import LikeButton from '../social/LikeButton'
import CommentSection from '../social/CommentSection'

export default function TechniqueDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, keycloak } = useAuth()
  const queryClient = useQueryClient()
  const [showConfirm, setShowConfirm] = useState(false)
  const [commentCount, setCommentCount] = useState(0)
  const { ingredientById, techniqueById } = useCatalogIndex()

  const { data: technique, isLoading, error } = useQuery({
    queryKey: ['catalog', 'techniques', id],
    queryFn: () => fetchTechnique(id!),
    enabled: !!id,
  })
  const delMutation = useMutation({
    mutationFn: () => deleteTechnique(id!),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['catalog', 'techniques'] }); navigate('/catalog/techniques') },
  })

  if (!id) return null
  if (isLoading) return <p className="text-center py-16 text-sm text-gray-400">Loading…</p>
  if (error || !technique) return <p className="text-center py-16 text-sm text-red-500">Technique not found.</p>

  const location = [technique.country, technique.region].filter(Boolean).join(', ')
  const canEdit = isAuthenticated && technique.createdBy === keycloak.tokenParsed?.preferred_username

  return (
    <>
    {showConfirm && (
      <ConfirmModal
        label={technique.name}
        onConfirm={() => delMutation.mutate()}
        onCancel={() => setShowConfirm(false)}
      />
    )}
    <div className="max-w-3xl mx-auto px-6 py-8">

      {/* Image gallery */}
      <EntityCardImage entityType="TECHNIQUE" entityId={technique.id} />

      {/* Title + meta */}
      <div className="mt-6 mb-2">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-[#171433]">{technique.name}</h1>
          {canEdit && (
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => navigate(`/catalog/techniques/${id}/edit`)}
                className="px-3 py-1.5 text-sm font-medium border border-[#8c2d9c] text-[#8c2d9c] rounded hover:bg-[#ede8ee] transition-colors">
                Edit
              </button>
              <button onClick={() => setShowConfirm(true)}
                className="px-3 py-1.5 text-sm font-medium border border-red-300 text-red-500 rounded hover:bg-red-50 transition-colors">
                Delete
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-xs bg-[#ede8ee] text-[#8c2d9c] px-3 py-1 rounded-full font-medium">{technique.difficulty}</span>
          {location && (
            <span className="text-xs bg-[#ede8ee] text-[#8c2d9c] px-3 py-1 rounded-full font-medium">{location}</span>
          )}
        </div>
      </div>

      <hr className="border-[#d67ec9] my-6" />

      <div className="space-y-6">
        {technique.steps?.length > 0 && (
          <div>
            <p className="font-bold text-sm text-[#171433] mb-2">Steps</p>
            <ol className="space-y-2">
              {technique.steps.map((s, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#8c2d9c] text-white text-xs flex items-center justify-center mt-0.5 font-bold">{i + 1}</span>
                  {s.instruction}
                </li>
              ))}
            </ol>
          </div>
        )}

        {(technique.culturalNotes || technique.description) && (
          <div>
            <p className="font-bold text-sm text-[#171433] mb-1">Cultural Notes</p>
            <p className="text-sm text-gray-700 leading-relaxed border-l-2 border-[#d67ec9] pl-3">
              {technique.culturalNotes || technique.description}
            </p>
          </div>
        )}

        {technique.prerequisites && (
          <div>
            <p className="font-bold text-sm text-[#171433] mb-2">Prerequisites</p>
            <ul className="space-y-1">
              {technique.prerequisites.split('\n').filter(Boolean).map((line, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-[#8c2d9c] font-bold mt-0.5">·</span> {line}
                </li>
              ))}
            </ul>
          </div>
        )}

        {technique.ingredientIds?.length > 0 && (
          <div>
            <p className="font-bold text-sm text-[#171433] mb-2">Related Ingredients</p>
            <ul className="space-y-1">
              {technique.ingredientIds.map((iid) => (
                <li key={iid} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-[#8c2d9c] font-bold mt-0.5">·</span>
                  <Link to={`/catalog/ingredients/${iid}`}
                    className="text-[#8c2d9c] hover:underline font-medium">
                    {ingredientById.get(iid) ?? iid}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {technique.relatedTechniqueIds?.length > 0 && (
          <div>
            <p className="font-bold text-sm text-[#171433] mb-2">Related Techniques</p>
            <ul className="space-y-1">
              {technique.relatedTechniqueIds.map((tid) => (
                <li key={tid} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-[#8c2d9c] font-bold mt-0.5">·</span>
                  <Link to={`/catalog/techniques/${tid}`}
                    className="text-[#8c2d9c] hover:underline font-medium">
                    {techniqueById.get(tid) ?? tid}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100">
          <LikeButton entityType="TECHNIQUE" entityId={technique.id} commentCount={commentCount} />
        </div>

        <CommentSection entityType="TECHNIQUE" entityId={technique.id} onCommentCountChange={setCommentCount} />

        {technique.createdBy && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Created by <Link to={`/profile/${technique.createdBy}`} className="font-medium text-[#8c2d9c] hover:underline">{technique.createdBy}</Link>
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
