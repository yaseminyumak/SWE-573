import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState, useEffect } from 'react'
import { fetchIngredients, fetchTechniques } from '../catalog/catalogApi'
import { fetchRecipes } from '../recipe/recipeApi'

function matchesQuery(fields: (string | null | undefined)[], q: string): boolean {
  return fields.some((f) => f?.toLowerCase().includes(q))
}

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialQ = searchParams.get('q') ?? ''
  const [inputValue, setInputValue] = useState(initialQ)

  useEffect(() => { setInputValue(initialQ) }, [initialQ])

  const { data: ingredients } = useQuery({ queryKey: ['catalog', 'ingredients'], queryFn: fetchIngredients, staleTime: 0 })
  const { data: techniques } = useQuery({ queryKey: ['catalog', 'techniques'], queryFn: fetchTechniques, staleTime: 0 })
  const { data: recipes } = useQuery({ queryKey: ['recipes'], queryFn: fetchRecipes, staleTime: 0 })

  const q = initialQ.trim().toLowerCase()

  const results = useMemo(() => ({
    recipes: (recipes ?? []).filter((r) =>
      matchesQuery([r.title, r.description, r.country, r.region, ...(r.tags ?? [])], q)
    ),
    techniques: (techniques ?? []).filter((t) =>
      matchesQuery([t.name, t.description, t.country, t.region, t.culturalNotes, t.prerequisites], q)
    ),
    ingredients: (ingredients ?? []).filter((i) =>
      matchesQuery([i.name, i.description, i.country, i.region, ...(i.seasons ?? []), ...(i.substitutes ?? [])], q)
    ),
  }), [q, recipes, techniques, ingredients])

  const total = results.recipes.length + results.techniques.length + results.ingredients.length

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`)
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

      {/* Search input */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search by name, country, tags…"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#8c2d9c] focus:ring-1 focus:ring-[#8c2d9c]"
        />
        <button
          type="submit"
          className="bg-[#8c2d9c] text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-[#7a2589] transition-colors"
        >
          Search
        </button>
      </form>

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
          Try a different keyword, country name, or tag.
        </div>
      )}

      {results.recipes.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-[#171433] uppercase tracking-wider mb-2">Recipes</h2>
          <ul className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            {results.recipes.map((r) => (
              <li key={r.id}>
                <Link to={`/recipes/${r.id}`}
                  className="flex flex-col gap-1 px-4 py-3 hover:bg-[#fdf8ff] transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-[#ede8ee] text-[#8c2d9c] px-2 py-0.5 rounded font-medium flex-shrink-0">Recipe</span>
                    <span className="text-sm font-medium text-[#171433] group-hover:text-[#8c2d9c] truncate">{r.title}</span>
                    {(r.country || r.region) && (
                      <span className="text-xs text-gray-400 ml-auto flex-shrink-0">
                        {[r.country, r.region].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </div>
                  {r.tags && r.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pl-1">
                      {r.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
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
                  className="flex flex-col gap-1 px-4 py-3 hover:bg-[#fdf8ff] transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-[#ede8ee] text-[#8c2d9c] px-2 py-0.5 rounded font-medium flex-shrink-0">Ingredient</span>
                    <span className="text-sm font-medium text-[#171433] group-hover:text-[#8c2d9c] truncate">{i.name}</span>
                    {(i.country || i.region) && (
                      <span className="text-xs text-gray-400 ml-auto flex-shrink-0">
                        {[i.country, i.region].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </div>
                  {i.seasons && i.seasons.length > 0 && (
                    <div className="flex flex-wrap gap-1 pl-1">
                      {i.seasons.map((s) => (
                        <span key={s} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                          {s.toLowerCase()}
                        </span>
                      ))}
                    </div>
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
