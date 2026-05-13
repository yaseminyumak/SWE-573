import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { fetchHeritages } from '../catalog/catalogApi'
import { useAuth } from '../../auth/AuthProvider'

export default function HeritageListPage() {
  const { isAuthenticated } = useAuth()
  const [selCountries, setSelCountries] = useState<string[]>([])
  const [applied, setApplied] = useState<string[]>([])

  const { data: heritages, isLoading, error } = useQuery({
    queryKey: ['heritage'],
    queryFn: fetchHeritages,
  })

  const countryOptions = useMemo(() => {
    const set = new Set(heritages?.map((h) => h.country).filter(Boolean))
    return Array.from(set).sort()
  }, [heritages])

  const toggle = (c: string) =>
    setSelCountries((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])

  const applyFilters = () => setApplied(selCountries)
  const clearFilters = () => { setSelCountries([]); setApplied([]) }

  const filtered = heritages?.filter((h) => {
    if (applied.length > 0 && !applied.includes(h.country)) return false
    return true
  }) ?? []

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-44 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4 shadow-sm">
            <p className="font-bold text-sm text-[#171433]">Filters</p>
            {countryOptions.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Country</label>
                <div className="space-y-1.5">
                  {countryOptions.map((c) => (
                    <label key={c} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selCountries.includes(c)}
                        onChange={() => toggle(c)}
                        className="accent-[#8c2d9c] w-3.5 h-3.5 flex-shrink-0"
                      />
                      <span className="text-xs text-gray-600 group-hover:text-[#8c2d9c] leading-tight">{c}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={applyFilters}
              className="w-full bg-[#8c2d9c] text-white rounded px-3 py-1.5 text-sm font-medium hover:bg-[#7a2589] transition-colors"
            >
              Apply Filters
            </button>
            {applied.length > 0 && (
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
            <h1 className="text-xl font-bold text-[#171433]">Heritage</h1>
            {isAuthenticated && (
              <Link
                to="/heritage/new"
                className="px-4 py-1.5 rounded bg-[#8c2d9c] text-white text-sm font-medium hover:bg-[#7a2589] transition-colors"
              >
                + Add Heritage
              </Link>
            )}
          </div>

          {isLoading && <p className="text-sm text-gray-400 py-8 text-center">Loading…</p>}
          {error && <p className="text-sm text-red-500 py-8 text-center">Failed to load heritage entries.</p>}
          {!isLoading && !error && filtered.length === 0 && (
            <p className="text-sm text-gray-400 py-8 text-center">No heritage entries found.</p>
          )}
          {filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {filtered.map((h) => (
                <Link
                  key={h.id}
                  to={`/heritage/${h.id}`}
                  className="border border-gray-200 rounded-xl bg-white hover:border-[#8c2d9c] hover:shadow-md transition-all group overflow-hidden flex flex-col"
                >
                  <div className="p-4">
                    <p className="font-bold text-sm text-[#171433] group-hover:text-[#8c2d9c] leading-snug">{h.name}</p>
                    {h.country && (
                      <p className="text-xs text-[#8c2d9c] mt-1 font-medium">{h.country}</p>
                    )}
                    {h.description && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{h.description}</p>
                    )}
                    {h.createdBy && (
                      <p className="text-xs text-gray-400 mt-2">
                        By{' '}
                        <Link
                          to={`/profile/${h.createdBy}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-[#8c2d9c] hover:underline"
                        >
                          {h.createdBy}
                        </Link>
                      </p>
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
