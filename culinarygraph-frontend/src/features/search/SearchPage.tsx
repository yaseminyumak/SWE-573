import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchIngredients, fetchTechniques } from '../catalog/catalogApi'
import { fetchRecipes } from '../recipe/recipeApi'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const initialQ = searchParams.get('q') ?? ''

  const { data: ingredients } = useQuery({ queryKey: ['catalog', 'ingredients'], queryFn: fetchIngredients })
  const { data: techniques } = useQuery({ queryKey: ['catalog', 'techniques'], queryFn: fetchTechniques })
  const { data: recipes } = useQuery({ queryKey: ['recipes'], queryFn: fetchRecipes })

  const q = initialQ.trim().toLowerCase()

  const results = useMemo(() => ({
    recipes: (recipes ?? []).filter((r) => r.title.toLowerCase().includes(q)),
    techniques: (techniques ?? []).filter((t) => t.name.toLowerCase().includes(q)),
    ingredients: (ingredients ?? []).filter((i) => i.name.toLowerCase().includes(q)),
  }), [q, recipes, techniques, ingredients])

  const total = results.recipes.length + results.techniques.length + results.ingredients.length

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

      {/* Result count */}
      {q && (
        <p className="text-sm text-gray-500">
          {total === 0
            ? <>No results for "<span className="font-medium text-[#8c2d9c]">{initialQ}</span>"</>
            : <><span className="font-medium text-[#171433]">{total}</span> result{total !== 1 ? 's' : ''} for "<span className="font-medium text-[#8c2d9c]">{initialQ}</span>"</>
          }
        </p>
      )}

      {q && total === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm">
          Try a different keyword.
        </div>
      )}

      {results.recipes.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-[#171433] uppercase tracking-wider mb-2">Recipes</h2>
          <ul className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            {results.recipes.map((r) => (
              <li key={r.id}>
                <Link to={`/recipes/${r.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#fdf8ff] transition-colors group">
                  <span className="text-xs bg-[#ede8ee] text-[#8c2d9c] px-2 py-0.5 rounded font-medium flex-shrink-0">Recipe</span>
                  <span className="text-sm font-medium text-[#171433] group-hover:text-[#8c2d9c] truncate">{r.title}</span>
                  {(r.country || r.region) && (
                    <span className="text-xs text-gray-400 ml-auto flex-shrink-0">
                      {[r.country, r.region].filter(Boolean).join(', ')}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {results.techniques.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-[#171433] uppercase tracking-wider mb-2">Techniques</h2>
          <ul className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            {results.techniques.map((t) => (
              <li key={t.id}>
                <Link to={`/catalog/techniques/${t.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#fdf8ff] transition-colors group">
                  <span className="text-xs bg-[#ede8ee] text-[#8c2d9c] px-2 py-0.5 rounded font-medium flex-shrink-0">Technique</span>
                  <span className="text-sm font-medium text-[#171433] group-hover:text-[#8c2d9c] truncate">{t.name}</span>
                  {(t.country || t.region) && (
                    <span className="text-xs text-gray-400 ml-auto flex-shrink-0">
                      {[t.country, t.region].filter(Boolean).join(', ')}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {results.ingredients.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-[#171433] uppercase tracking-wider mb-2">Ingredients</h2>
          <ul className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            {results.ingredients.map((i) => (
              <li key={i.id}>
                <Link to={`/catalog/ingredients/${i.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#fdf8ff] transition-colors group">
                  <span className="text-xs bg-[#ede8ee] text-[#8c2d9c] px-2 py-0.5 rounded font-medium flex-shrink-0">Ingredient</span>
                  <span className="text-sm font-medium text-[#171433] group-hover:text-[#8c2d9c] truncate">{i.name}</span>
                  {(i.country || i.region) && (
                    <span className="text-xs text-gray-400 ml-auto flex-shrink-0">
                      {[i.country, i.region].filter(Boolean).join(', ')}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
