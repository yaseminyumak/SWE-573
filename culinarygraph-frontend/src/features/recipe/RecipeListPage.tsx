import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { fetchRecipes } from './recipeApi'
import { useAuth } from '../../auth/AuthProvider'

const DIFFICULTIES = ['All Difficulties', 'EASY', 'MEDIUM', 'HARD']

export default function RecipeListPage() {
  const { isAuthenticated } = useAuth()
  const [tags, setTags] = useState('')
  const [difficulty, setDifficulty] = useState('All Difficulties')
  const [duration, setDuration] = useState('')
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('')
  const [applied, setApplied] = useState({ tags: '', difficulty: 'All Difficulties', duration: '', country: '', region: '' })

  const { data: recipes, isLoading, error } = useQuery({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
  })

  const applyFilters = () => setApplied({ tags, difficulty, duration, country, region })

  const filtered = recipes?.filter((r) => {
    if (applied.difficulty !== 'All Difficulties' && r.difficulty !== applied.difficulty) return false
    if (applied.tags && !r.tags?.some((t) => t.toLowerCase().includes(applied.tags.toLowerCase()))) return false
    const loc = `${r.country ?? ''} ${r.region ?? ''}`.toLowerCase()
    if (applied.country && !loc.includes(applied.country.toLowerCase())) return false
    if (applied.region && !loc.includes(applied.region.toLowerCase())) return false
    return true
  }) ?? []

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-44 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4 shadow-sm">
            <p className="font-bold text-sm text-[#171433]">Filters</p>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tags</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., Vegetarian"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#8c2d9c]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#8c2d9c]">
                {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Duration</label>
              <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 30 min"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#8c2d9c]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Country</label>
              <select value={country || 'All Countries'} onChange={(e) => setCountry(e.target.value === 'All Countries' ? '' : e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#8c2d9c]">
                <option>All Countries</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Region</label>
              <input type="text" value={region} onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g., Aegean Region"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#8c2d9c]" />
            </div>
            <button onClick={applyFilters}
              className="w-full bg-[#8c2d9c] text-white rounded px-3 py-1.5 text-sm font-medium hover:bg-[#7a2589] transition-colors">
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-[#171433]">Recipes</h1>
            {isAuthenticated && (
              <Link to="/recipes/new"
                className="px-4 py-1.5 rounded bg-[#8c2d9c] text-white text-sm font-medium hover:bg-[#7a2589] transition-colors">
                + Add Recipe
              </Link>
            )}
          </div>

          {isLoading && <p className="text-sm text-gray-400 py-8 text-center">Loading…</p>}
          {error && <p className="text-sm text-red-500 py-8 text-center">Failed to load recipes.</p>}
          {!isLoading && !error && filtered.length === 0 && (
            <p className="text-sm text-gray-400 py-8 text-center">No recipes found.</p>
          )}
          {filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {filtered.map((r) => (
                <Link key={r.id} to={`/recipes/${r.id}`}
                  className="border border-gray-200 rounded-lg bg-white p-5 hover:border-[#8c2d9c] hover:shadow-sm transition-all group">
                  <p className="font-bold text-sm text-[#171433] group-hover:text-[#8c2d9c]">{r.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Difficulty: {r.difficulty}{r.durationMinutes ? `, Duration: ${r.durationMinutes} min` : ''}
                  </p>
                  {(r.country || r.region) && (
                    <p className="text-xs text-[#8c2d9c] mt-1 font-medium">{[r.country, r.region].filter(Boolean).join(', ')}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
