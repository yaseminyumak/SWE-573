import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { fetchIngredient, archiveIngredient, fetchTechniques } from './catalogApi'
import { useAuth } from '../../auth/AuthProvider'
import { Link } from 'react-router-dom'

export default function IngredientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()

  const { data: ingredient, isLoading, error } = useQuery({
    queryKey: ['catalog', 'ingredients', id],
    queryFn: () => fetchIngredient(id!),
    enabled: !!id,
  })

  const { data: allTechniques } = useQuery({
    queryKey: ['catalog', 'techniques'],
    queryFn: fetchTechniques,
  })

  const archiveMutation = useMutation({
    mutationFn: () => archiveIngredient(id!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['catalog', 'ingredients', id] }),
  })

  if (!id) return null
  if (isLoading) return <p className="text-center py-16 text-sm text-gray-400">Loading…</p>
  if (error || !ingredient) return <p className="text-center py-16 text-sm text-red-500">Ingredient not found.</p>

  const linkedTechniques = allTechniques?.filter((t) => t.ingredientIds?.includes(id)) ?? []
  const allRelated = [
    ...(ingredient.relatedTechniqueNames ?? []),
    ...linkedTechniques.map((t) => t.name),
  ].filter((v, i, a) => a.indexOf(v) === i)

  const techniqueByName = new Map(allTechniques?.map((t) => [t.name, t.id]) ?? [])

  const location = [ingredient.country, ingredient.region].filter(Boolean).join(', ')
  const seasonality = ingredient.seasons?.join(', ')

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-[#171433]">{ingredient.name}</h1>
      <hr className="my-4 border-[#d67ec9]" />

      <div className="space-y-6">
        {location && (
          <div>
            <p className="font-bold text-sm text-[#171433] mb-0.5">Country + Region</p>
            <p className="text-sm text-gray-700">{location}</p>
          </div>
        )}

        {seasonality && (
          <div>
            <p className="font-bold text-sm text-[#171433] mb-0.5">Seasonality</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {ingredient.seasons.map((s) => (
                <span key={s} className="text-xs bg-[#ede8ee] border border-[#d67ec9] text-[#8c2d9c] px-3 py-0.5 rounded-full font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {ingredient.provenanceStory && (
          <div>
            <p className="font-bold text-sm text-[#171433] mb-0.5">Provenance Story</p>
            <p className="text-sm text-gray-700 leading-relaxed border-l-2 border-[#d67ec9] pl-3 italic">
              {ingredient.provenanceStory}
            </p>
          </div>
        )}

        {ingredient.substitutes?.length > 0 && (
          <div>
            <p className="font-bold text-sm text-[#171433] mb-0.5">Substitutions</p>
            <ul className="mt-1 space-y-1">
              {ingredient.substitutes.map((s, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-[#8c2d9c] font-bold mt-0.5">·</span> {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {allRelated.length > 0 && (
          <div>
            <p className="font-bold text-sm text-[#171433] mb-0.5">Related Techniques</p>
            <ul className="mt-1 space-y-1">
              {allRelated.map((name, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-[#8c2d9c] font-bold mt-0.5">·</span>
                  {techniqueByName.get(name) ? (
                    <Link to={`/catalog/techniques/${techniqueByName.get(name)}`}
                      className="text-[#8c2d9c] hover:underline font-medium">{name}</Link>
                  ) : name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isAuthenticated && ingredient.status !== 'ARCHIVED' && (
        <div className="mt-8 pt-4 border-t border-gray-200">
          <button
            onClick={() => archiveMutation.mutate()}
            disabled={archiveMutation.isPending}
            className="border border-gray-300 rounded px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            Archive
          </button>
        </div>
      )}
    </div>
  )
}
