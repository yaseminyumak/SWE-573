import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchIngredient, fetchTechniques, deleteIngredient } from './catalogApi'
import ImageManager from '../../shared/components/ImageManager'
import ConfirmModal from '../../shared/components/ConfirmModal'
import { useCatalogIndex } from '../../shared/hooks/useCatalogIndex'
import { useAuth } from '../../auth/AuthProvider'
import LikeButton from '../social/LikeButton'
import CommentSection from '../social/CommentSection'

export default function IngredientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, keycloak } = useAuth()
  const queryClient = useQueryClient()
  const [showConfirm, setShowConfirm] = useState(false)
  const [commentCount, setCommentCount] = useState(0)
  const { techniqueById } = useCatalogIndex()

  const { data: ingredient, isLoading, error } = useQuery({
    queryKey: ['catalog', 'ingredients', id],
    queryFn: () => fetchIngredient(id!),
    enabled: !!id,
  })
  const { data: allTechniques } = useQuery({
    queryKey: ['catalog', 'techniques'],
    queryFn: fetchTechniques,
  })

  const delMutation = useMutation({
    mutationFn: () => deleteIngredient(id!),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['catalog', 'ingredients'] }); navigate('/catalog/ingredients') },
  })

  if (!id) return null
  if (isLoading) return <p className="text-center py-16 text-sm text-gray-400">Loading…</p>
  if (error || !ingredient) return <p className="text-center py-16 text-sm text-red-500">Ingredient not found.</p>

  // Combine explicitly linked techniques (relatedTechniqueIds) with reverse-lookup from technique.ingredientIds
  const linkedTechniqueIds = allTechniques?.filter((t) => t.ingredientIds?.includes(id!)).map((t) => t.id) ?? []
  const allRelatedIds = [...new Set([
    ...(ingredient.relatedTechniqueIds ?? []),
    ...linkedTechniqueIds,
  ])]
  const location = [ingredient.country, ingredient.region].filter(Boolean).join(', ')
  const canEdit = isAuthenticated && ingredient.createdBy === keycloak.tokenParsed?.preferred_username

  return (
    <>
    {showConfirm && (
      <ConfirmModal
        label={ingredient.name}
        onConfirm={() => delMutation.mutate()}
        onCancel={() => setShowConfirm(false)}
      />
    )}
    <div className="max-w-3xl mx-auto px-6 py-8">

      {/* Image gallery */}
      <ImageManager entityType="INGREDIENT" entityId={ingredient.id} canEdit={canEdit} />

      {/* Title + meta */}
      <div className="mt-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-[#171433]">{ingredient.name}</h1>
          {canEdit && (
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => navigate(`/catalog/ingredients/${id}/edit`)}
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
          {location && (
            <span className="text-xs bg-[#ede8ee] text-[#8c2d9c] px-3 py-1 rounded-full font-medium">{location}</span>
          )}
          {ingredient.seasons?.map((s) => (
            <span key={s} className="text-xs bg-[#ede8ee] border border-[#d67ec9] text-[#8c2d9c] px-3 py-1 rounded-full font-medium">{s}</span>
          ))}
        </div>
      </div>

      <hr className="border-[#d67ec9] mb-6" />

      <div className="space-y-6">
        {ingredient.provenanceStory && (
          <div>
            <p className="font-bold text-sm text-[#171433] mb-1">Provenance Story</p>
            <p className="text-sm text-gray-700 leading-relaxed border-l-2 border-[#d67ec9] pl-3 italic">
              {ingredient.provenanceStory}
            </p>
          </div>
        )}

        {ingredient.substitutes?.length > 0 && (
          <div>
            <p className="font-bold text-sm text-[#171433] mb-1">Substitutions</p>
            <ul className="space-y-1">
              {ingredient.substitutes.map((s, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-[#8c2d9c] font-bold mt-0.5">·</span> {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {allRelatedIds.length > 0 && (
          <div>
            <p className="font-bold text-sm text-[#171433] mb-1">Related Techniques</p>
            <ul className="space-y-1">
              {allRelatedIds.map((tid) => (
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
          <LikeButton entityType="INGREDIENT" entityId={ingredient.id} commentCount={commentCount} />
        </div>

        <CommentSection entityType="INGREDIENT" entityId={ingredient.id} onCommentCountChange={setCommentCount} />

        {ingredient.createdBy && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Created by <Link to={`/profile/${ingredient.createdBy}`} className="font-medium text-[#8c2d9c] hover:underline">{ingredient.createdBy}</Link>
            </p>
          </div>
        )}
      </div>

    </div>
    </>
  )
}
