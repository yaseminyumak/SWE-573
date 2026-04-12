import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { fetchRecipe } from './recipeApi'
import { useCatalogIndex } from '../../shared/hooks/useCatalogIndex'

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['recipes', id],
    queryFn: () => fetchRecipe(id!),
    enabled: !!id,
  })
  const { ingredientByName, techniqueByName } = useCatalogIndex()

  if (!id) return null
  if (isLoading) return <p className="text-center py-16 text-sm text-gray-400">Loading…</p>
  if (error || !recipe) return <p className="text-center py-16 text-sm text-red-500">Recipe not found.</p>
  const location = [recipe.country, recipe.region].filter(Boolean).join(', ')

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-[#171433]">{recipe.title}</h1>
      <hr className="my-4 border-[#d67ec9]" />

      <div className="space-y-1 mb-6">
        <p className="text-sm text-gray-700"><span className="font-bold text-[#171433]">Difficulty:</span> {recipe.difficulty}</p>
        {recipe.durationMinutes != null && (
          <p className="text-sm text-gray-700"><span className="font-bold text-[#171433]">Duration:</span> {recipe.durationMinutes} minutes</p>
        )}
        {location && (
          <p className="text-sm text-gray-700"><span className="font-bold text-[#171433]">Region:</span> {location}</p>
        )}
      </div>

      <div className="space-y-6">
        {recipe.ingredients?.length > 0 && (
          <div>
            <h2 className="font-bold text-base text-[#171433] mb-2">Ingredients</h2>
            <ul className="space-y-1">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-[#8c2d9c] font-bold mt-0.5">·</span>
                  <span>
                    {ingredientByName.get(ing.name) ? (
                      <Link to={`/catalog/ingredients/${ingredientByName.get(ing.name)}`}
                        className="text-[#8c2d9c] hover:underline font-medium">{ing.name}</Link>
                    ) : ing.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {recipe.associatedTechniqueNames?.length > 0 && (
          <div>
            <h2 className="font-bold text-base text-[#171433] mb-2">Associated Techniques</h2>
            <ul className="space-y-1">
              {recipe.associatedTechniqueNames.map((name, i) => (
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

        {recipe.steps?.length > 0 && (
          <div>
            <h2 className="font-bold text-base text-[#171433] mb-2">Steps</h2>
            <ul className="space-y-2">
              {recipe.steps.map((s, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-[#8c2d9c] font-bold mt-0.5">·</span> {s.instruction}
                </li>
              ))}
            </ul>
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

        {recipe.originStory && (
          <div>
            <h2 className="font-bold text-base text-[#171433] mb-2">Origin Story</h2>
            <p className="text-sm text-gray-700 leading-relaxed border-l-2 border-[#d67ec9] pl-3 italic">
              {recipe.originStory}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
