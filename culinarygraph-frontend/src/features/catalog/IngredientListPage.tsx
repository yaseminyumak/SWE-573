import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { fetchIngredients } from './catalogApi'
import { useAuth } from '../../auth/AuthProvider'

const SEASONS = ['All Seasons', 'SPRING', 'SUMMER', 'FALL', 'WINTER', 'YEAR_ROUND']

export default function IngredientListPage() {
  const { isAuthenticated } = useAuth()
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('')
  const [season, setSeason] = useState('All Seasons')
  const [applied, setApplied] = useState({ country: '', region: '', season: 'All Seasons' })

  const { data: ingredients, isLoading, error } = useQuery({
    queryKey: ['catalog', 'ingredients'],
    queryFn: fetchIngredients,
  })

  const applyFilters = () => setApplied({ country, region, season })

  const filtered = ingredients?.filter((ing) => {
    const loc = `${ing.country ?? ''} ${ing.region ?? ''}`.toLowerCase()
    if (applied.country && !loc.includes(applied.country.toLowerCase())) return false
    if (applied.region && !loc.includes(applied.region.toLowerCase())) return false
    if (applied.season !== 'All Seasons' && !ing.seasons?.includes(applied.season as any)) return false
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
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Country</label>
              <select
                value={country || 'All Countries'}
                onChange={(e) => setCountry(e.target.value === 'All Countries' ? '' : e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#8c2d9c]"
              >
                <option>All Countries</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Region</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g., Aegean Region"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#8c2d9c]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Season</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#8c2d9c]"
              >
                {SEASONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <button
              onClick={applyFilters}
              className="w-full bg-[#8c2d9c] text-white rounded px-3 py-1.5 text-sm font-medium hover:bg-[#7a2589] transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-[#171433]">Ingredients</h1>
            {isAuthenticated && (
              <Link to="/catalog/ingredients/new"
                className="px-4 py-1.5 rounded bg-[#8c2d9c] text-white text-sm font-medium hover:bg-[#7a2589] transition-colors">
                + Add Ingredient
              </Link>
            )}
          </div>

          {isLoading && <p className="text-sm text-gray-400 py-8 text-center">Loading…</p>}
          {error && <p className="text-sm text-red-500 py-8 text-center">Failed to load ingredients.</p>}
          {!isLoading && !error && filtered.length === 0 && (
            <p className="text-sm text-gray-400 py-8 text-center">No ingredients found.</p>
          )}
          {filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {filtered.map((ing) => (
                <Link key={ing.id} to={`/catalog/ingredients/${ing.id}`}
                  className="border border-gray-200 rounded-lg bg-white p-5 hover:border-[#8c2d9c] hover:shadow-sm transition-all group">
                  <p className="font-bold text-sm text-[#171433] group-hover:text-[#8c2d9c]">{ing.name}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {[ing.country, ing.region].filter(Boolean).join(', ') || 'No region'}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
