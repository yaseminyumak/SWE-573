import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'
import { fetchRecipes } from './recipeApi'
import type { RecipeResponse } from './recipeApi'

function RecipeCard({ r }: { r: RecipeResponse }) {
  return (
    <Link
      to={`/recipes/${r.id}`}
      className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <h3 className="font-semibold">{r.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {r.difficulty} · {r.durationMinutes != null ? `${r.durationMinutes} min` : '—'} · {r.status}
      </p>
    </Link>
  )
}

export default function RecipeListPage() {
  const { isAuthenticated } = useAuth()
  const { data: recipes, isLoading, error } = useQuery({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
  })

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Recipes</h1>
        {isAuthenticated && (
          <Link
            to="/recipes/new"
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            New recipe
          </Link>
        )}
      </div>
      {isLoading && <p className="text-gray-500">Loading…</p>}
      {error && <p className="text-red-600">Failed to load recipes.</p>}
      {recipes && (
        <ul className="space-y-3">
          {recipes.length === 0 ? (
            <li className="text-gray-500">No recipes yet.</li>
          ) : (
            recipes.map((r) => (
              <li key={r.id}>
                <RecipeCard r={r} />
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
