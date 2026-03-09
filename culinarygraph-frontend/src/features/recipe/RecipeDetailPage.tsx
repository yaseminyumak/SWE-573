import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { fetchRecipe } from './recipeApi'

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['recipes', id],
    queryFn: () => fetchRecipe(id!),
    enabled: !!id,
  })

  if (!id) return <div className="p-8">Missing recipe id.</div>
  if (isLoading) return <div className="p-8">Loading…</div>
  if (error || !recipe) return <div className="p-8">Recipe not found.</div>

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link to="/recipes" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to recipes
      </Link>
      <h1 className="text-2xl font-bold">{recipe.title}</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1">
        {recipe.difficulty} · {recipe.durationMinutes != null ? `${recipe.durationMinutes} min` : '—'} · {recipe.status}
      </p>
      {recipe.description && (
        <p className="mt-4 text-gray-700 dark:text-gray-300">{recipe.description}</p>
      )}
      <section className="mt-6">
        <h2 className="font-semibold">Ingredients</h2>
        <ul className="list-disc list-inside mt-2">
          {recipe.ingredients.map((i, idx) => (
            <li key={idx}>
              {i.name}
              {i.quantity || i.unit ? ` — ${[i.quantity, i.unit].filter(Boolean).join(' ')}` : ''}
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-6">
        <h2 className="font-semibold">Steps</h2>
        <ol className="list-decimal list-inside mt-2 space-y-2">
          {recipe.steps.map((s, idx) => (
            <li key={idx}>{s.instruction}</li>
          ))}
        </ol>
      </section>
    </div>
  )
}
