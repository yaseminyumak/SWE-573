import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { fetchTechniques } from './catalogApi'
import { useAuth } from '../../auth/AuthProvider'
import EntityCardImage from '../../shared/components/EntityCardImage'

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD']
const DIFFICULTY_LABELS: Record<string, string> = { EASY: 'Easy', MEDIUM: 'Medium', HARD: 'Hard' }

function CheckboxGroup({ options, selected, onChange, labelFn }: {
  options: string[]
  selected: string[]
  onChange: (v: string[]) => void
  labelFn?: (o: string) => string
}) {
  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt])
  return (
    <div className="space-y-1.5">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
            className="accent-[#8c2d9c] w-3.5 h-3.5 flex-shrink-0"
          />
          <span className="text-xs text-gray-600 group-hover:text-[#8c2d9c] leading-tight">
            {labelFn ? labelFn(opt) : opt}
          </span>
        </label>
      ))}
    </div>
  )
}

export default function TechniqueListPage() {
  const { isAuthenticated } = useAuth()
  const [selCountries, setSelCountries] = useState<string[]>([])
  const [region, setRegion] = useState('')
  const [selDifficulties, setSelDifficulties] = useState<string[]>([])
  const [applied, setApplied] = useState({
    countries: [] as string[], region: '', difficulties: [] as string[],
  })

  const { data: techniques, isLoading, error } = useQuery({
    queryKey: ['catalog', 'techniques'],
    queryFn: fetchTechniques,
  })

  const countryOptions = useMemo(() => {
    const set = new Set(techniques?.map((t) => t.country).filter(Boolean) as string[])
    return Array.from(set).sort()
  }, [techniques])

  const applyFilters = () => setApplied({ countries: selCountries, region, difficulties: selDifficulties })

  const clearFilters = () => {
    setSelCountries([]); setRegion(''); setSelDifficulties([])
    setApplied({ countries: [], region: '', difficulties: [] })
  }

  const hasActiveFilters = applied.countries.length > 0 || applied.region || applied.difficulties.length > 0

  const filtered = techniques?.filter((t) => {
    if (applied.countries.length > 0 && !applied.countries.includes(t.country ?? '')) return false
    const loc = `${t.country ?? ''} ${t.region ?? ''}`.toLowerCase()
    if (applied.region && !loc.includes(applied.region.toLowerCase())) return false
    if (applied.difficulties.length > 0 && !applied.difficulties.includes(t.difficulty)) return false
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
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Difficulty</label>
              <CheckboxGroup
                options={DIFFICULTIES}
                selected={selDifficulties}
                onChange={setSelDifficulties}
                labelFn={(d) => DIFFICULTY_LABELS[d] ?? d}
              />
            </div>

            {countryOptions.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Country</label>
                <CheckboxGroup options={countryOptions} selected={selCountries} onChange={setSelCountries} />
              </div>
            )}

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

            <button
              onClick={applyFilters}
              className="w-full bg-[#8c2d9c] text-white rounded px-3 py-1.5 text-sm font-medium hover:bg-[#7a2589] transition-colors"
            >
              Apply Filters
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full text-xs text-gray-400 hover:text-[#8c2d9c] transition-colors py-0.5"
              >
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-[#171433]">Techniques</h1>
            {isAuthenticated && (
              <Link to="/catalog/techniques/new"
                className="px-4 py-1.5 rounded bg-[#8c2d9c] text-white text-sm font-medium hover:bg-[#7a2589] transition-colors">
                + Add Technique
              </Link>
            )}
          </div>

          {isLoading && <p className="text-sm text-gray-400 py-8 text-center">Loading…</p>}
          {error && <p className="text-sm text-red-500 py-8 text-center">Failed to load techniques.</p>}
          {!isLoading && !error && filtered.length === 0 && (
            <p className="text-sm text-gray-400 py-8 text-center">No techniques found.</p>
          )}
          {filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {filtered.map((t) => (
                <Link key={t.id} to={`/catalog/techniques/${t.id}`}
                  className="border border-gray-200 rounded-xl bg-white hover:border-[#8c2d9c] hover:shadow-md transition-all group overflow-hidden flex flex-col">
                  <EntityCardImage entityType="TECHNIQUE" entityId={t.id} />
                  <div className="p-4">
                    <p className="font-bold text-sm text-[#171433] group-hover:text-[#8c2d9c] leading-snug">{t.name}</p>
                    {t.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{t.description}</p>}
                    {(t.country || t.region) && (
                      <p className="text-xs text-[#8c2d9c] mt-1 font-medium">{[t.country, t.region].filter(Boolean).join(', ')}</p>
                    )}
                    {t.createdBy && (
                      <p className="text-xs text-gray-400 mt-2">By {t.createdBy}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
