import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { fetchTechnique, archiveTechnique } from './catalogApi'
import { fetchIngredients, fetchTechniques } from './catalogApi'
import { useAuth } from '../../auth/AuthProvider'
import { Link } from 'react-router-dom'

export default function TechniqueDetailPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()

  const { data: technique, isLoading, error } = useQuery({
    queryKey: ['catalog', 'techniques', id],
    queryFn: () => fetchTechnique(id!),
    enabled: !!id,
  })

  const { data: allIngredients = [] } = useQuery({ queryKey: ['catalog', 'ingredients'], queryFn: fetchIngredients })
  const { data: allTechniques = [] } = useQuery({ queryKey: ['catalog', 'techniques'], queryFn: fetchTechniques })

  const ingredientByName = new Map(allIngredients.map((i) => [i.name, i.id]))
  const techniqueByName = new Map(allTechniques.map((t) => [t.name, t.id]))

  const archiveMutation = useMutation({
    mutationFn: () => archiveTechnique(id!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['catalog', 'techniques', id] }),
  })

  if (!id) return null
  if (isLoading) return <p className="text-center py-16 text-sm text-gray-400">Loading…</p>
  if (error || !technique) return <p className="text-center py-16 text-sm text-red-500">Technique not found.</p>

  const location = [
    technique.country ? `Country: ${technique.country}` : null,
    technique.region ? `Region: ${technique.region}` : null,
  ].filter(Boolean).join(', ')

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold text-[#171433]">{technique.name}</h1>
        {isAuthenticated && (
          <div className="flex gap-2">
            <button className="border border-gray-300 rounded px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              Edit
            </button>
            <button
              onClick={() => archiveMutation.mutate()}
              disabled={archiveMutation.isPending}
              className="border border-red-300 rounded px-4 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {location && <p className="text-sm text-gray-500 mt-1">{location}</p>}
      <hr className="my-4 border-[#d67ec9]" />

      <div className="space-y-6">
        {technique.steps?.length > 0 && (
          <div>
            <p className="font-bold text-sm text-[#171433] mb-2">Steps</p>
            <ul className="space-y-1">
              {technique.steps.map((s, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-[#8c2d9c] font-bold mt-0.5">·</span> {s.instruction}
                </li>
              ))}
            </ul>
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

        {technique.relatedIngredientNames?.length > 0 && (
          <div>
            <p className="font-bold text-sm text-[#171433] mb-2">Related Ingredients</p>
            <ul className="space-y-1">
              {technique.relatedIngredientNames.map((name, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-[#8c2d9c] font-bold mt-0.5">·</span>
                  {ingredientByName.get(name) ? (
                    <Link to={`/catalog/ingredients/${ingredientByName.get(name)}`}
                      className="text-[#8c2d9c] hover:underline font-medium">{name}</Link>
                  ) : name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {technique.relatedTechniqueNames?.length > 0 && (
          <div>
            <p className="font-bold text-sm text-[#171433] mb-2">Related Techniques</p>
            <ul className="space-y-1">
              {technique.relatedTechniqueNames.map((name, i) => (
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
    </div>
  )
}
