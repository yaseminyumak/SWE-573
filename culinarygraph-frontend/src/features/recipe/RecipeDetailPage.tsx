import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchRecipe, deleteRecipe } from './recipeApi'
import { useCatalogIndex } from '../../shared/hooks/useCatalogIndex'
import EntityCardImage from '../../shared/components/EntityCardImage'
import ConfirmModal from '../../shared/components/ConfirmModal'
import { useAuth } from '../../auth/AuthProvider'
import LikeButton from '../social/LikeButton'
import CommentSection from '../social/CommentSection'

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, keycloak } = useAuth()
  const queryClient = useQueryClient()
  const [showConfirm, setShowConfirm] = useState(false)
  const [commentCount, setCommentCount] = useState(0)
  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['recipes', id],
    queryFn: () => fetchRecipe(id!),
    enabled: !!id,
  })
  const { techniqueById, ingredientByName } = useCatalogIndex()
  const delMutation = useMutation({
    mutationFn: () => deleteRecipe(id!),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['recipes'] }); navigate('/recipes') },
  })

  if (!id) return null
  if (isLoading) return <p className="text-center py-16 text-sm text-gray-400">Loading…</p>
  if (error || !recipe) return <p className="text-center py-16 text-sm text-red-500">Recipe not found.</p>

  const location = [recipe.country, recipe.region].filter(Boolean).join(', ')
  const canEdit = isAuthenticated && recipe.createdBy === keycloak.tokenParsed?.preferred_username

  return (
    <>
    {showConfirm && (
      <ConfirmModal
        label={recipe.title}
        onConfirm={() => delMutation.mutate()}
        onCancel={() => setShowConfirm(false)}
      />
    )}
    <div className="max-w-3xl mx-auto px-6 py-8">

      {/* Cover image */}
      <EntityCardImage entityType="RECIPE" entityId={recipe.id} />

      {/* Title + meta */}
      <div className="mt-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-[#171433]">{recipe.title}</h1>
          {canEdit && (
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => navigate(`/recipes/${id}/edit`)}
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
        <div className="flex flex-wrap gap-3 mt-2">
          <span className="text-xs bg-[#ede8ee] text-[#8c2d9c] px-3 py-1 rounded-full font-medium">{recipe.difficulty}</span>
          {recipe.durationMinutes != null && (
            <span className="text-xs bg-[#ede8ee] text-[#8c2d9c] px-3 py-1 rounded-full font-medium">{recipe.durationMinutes} min</span>
          )}
          {location && (
            <span className="text-xs bg-[#ede8ee] text-[#8c2d9c] px-3 py-1 rounded-full font-medium">{location}</span>
          )}
        </div>
      </div>

      <hr className="border-[#d67ec9] mb-6" />

      <div className="space-y-6">
        {recipe.ingredients?.length > 0 && (
          <div>
            <h2 className="font-bold text-base text-[#171433] mb-2">Ingredients</h2>
            <ul className="space-y-1">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-[#8c2d9c] font-bold mt-0.5">·</span>
                  <span>
                    {(() => {
                      const resolvedId = ing.ingredientId ?? ingredientByName.get(ing.name)
                      return resolvedId ? (
                        <Link to={`/catalog/ingredients/${resolvedId}`}
                          className="text-[#8c2d9c] hover:underline font-medium">{ing.name}</Link>
                      ) : ing.name
                    })()}
                    {(ing.quantity || ing.unit) && (
                      <span className="text-gray-400 ml-1">
                        {[ing.quantity, ing.unit].filter(Boolean).join(' ')}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {recipe.associatedTechniqueIds?.length > 0 && (
          <div>
            <h2 className="font-bold text-base text-[#171433] mb-2">Associated Techniques</h2>
            <ul className="space-y-1">
              {recipe.associatedTechniqueIds.map((id) => (
                <li key={id} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-[#8c2d9c] font-bold mt-0.5">·</span>
                  <Link to={`/catalog/techniques/${id}`}
                    className="text-[#8c2d9c] hover:underline font-medium">
                    {techniqueById.get(id) ?? id}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {recipe.steps?.length > 0 && (
          <div>
            <h2 className="font-bold text-base text-[#171433] mb-2">Steps</h2>
            <ol className="space-y-2">
              {recipe.steps.map((s, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#8c2d9c] text-white text-xs flex items-center justify-center mt-0.5 font-bold">{i + 1}</span>
                  {s.instruction}
                </li>
              ))}
            </ol>
          </div>
        )}

        {recipe.tags?.length > 0 && (
          <div>
            <h2 className="font-bold text-base text-[#171433] mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, i) => (
                <span key={i} className="bg-[#ede8ee] border border-[#d67ec9] text-[#8c2d9c] px-3 py-0.5 rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {recipe.specialDays?.length > 0 && (
          <div>
            <h2 className="font-bold text-base text-[#171433] mb-2">Special Days</h2>
            <div className="flex flex-wrap gap-2">
              {recipe.specialDays.map((day, i) => (
                <Link key={i} to={`/recipes?specialDay=${encodeURIComponent(day)}`}
                  className="bg-[#ede8ee] border border-[#d67ec9] text-[#8c2d9c] px-3 py-0.5 rounded-full text-sm font-medium hover:bg-[#d67ec9] hover:text-white transition-colors">
                  {day}
                </Link>
              ))}
            </div>
          </div>
        )}

        {recipe.originStory && (
          <div>
            <h2 className="font-bold text-base text-[#171433] mb-2">Origin Story</h2>
            <p className="text-sm text-gray-700 leading-relaxed border-l-2 border-[#d67ec9] pl-3 italic">
              {recipe.originStory}
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100">
          <LikeButton entityType="RECIPE" entityId={recipe.id} commentCount={commentCount} />
        </div>

        <CommentSection entityType="RECIPE" entityId={recipe.id} onCommentCountChange={setCommentCount} />

        {recipe.createdBy && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Created by <Link to={`/profile/${recipe.createdBy}`} className="font-medium text-[#8c2d9c] hover:underline">{recipe.createdBy}</Link>
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
