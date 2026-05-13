import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { fetchRecipes } from './recipeApi'
import { fetchHeritages } from '../catalog/catalogApi'
import { useAuth } from '../../auth/AuthProvider'
import EntityCardImage from '../../shared/components/EntityCardImage'
import { SPECIAL_DAYS } from '../../shared/components/SpecialDaysPicker'

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD']
const DIFFICULTY_LABELS: Record<string, string> = { EASY: 'Easy', MEDIUM: 'Medium', HARD: 'Hard' }

const MAX_DUR = 240
const DUR_STEP = 5

function fmtMin(m: number) {
  if (m === 0) return '0'
  const h = Math.floor(m / 60)
  const mins = m % 60
  if (h === 0) return `${mins}m`
  if (mins === 0) return `${h}h`
  return `${h}h ${mins}m`
}

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

function SearchableCheckboxGroup({ options, selected, onChange, placeholder }: {
  options: string[]
  selected: string[]
  onChange: (v: string[]) => void
  placeholder?: string
}) {
  const [search, setSearch] = useState('')
  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt])
  const filtered = options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-2">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selected.map((s) => (
            <span key={s} className="inline-flex items-center gap-0.5 bg-[#ede8ee] border border-[#d67ec9] text-[#8c2d9c] px-1.5 py-0.5 rounded text-[10px] font-medium max-w-full">
              <span className="truncate">{s}</span>
              <button type="button" onClick={() => toggle(s)} className="leading-none hover:text-[#7a2589] flex-shrink-0 ml-0.5">×</button>
            </span>
          ))}
        </div>
      )}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder ?? 'Search…'}
        className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#8c2d9c]"
      />
      <div className="max-h-36 overflow-y-auto space-y-1.5 pr-0.5">
        {filtered.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
              className="accent-[#8c2d9c] w-3.5 h-3.5 flex-shrink-0"
            />
            <span className="text-xs text-gray-600 group-hover:text-[#8c2d9c] leading-tight">{opt}</span>
          </label>
        ))}
        {filtered.length === 0 && (
          <p className="text-[10px] text-gray-400 py-1">No matches</p>
        )}
      </div>
    </div>
  )
}

function DualRangeSlider({ value, onChange }: {
  value: [number, number]
  onChange: (v: [number, number]) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef<'lo' | 'hi' | null>(null)
  const valueRef = useRef(value)
  valueRef.current = value

  const [lo, hi] = value
  const pct = (v: number) => (v / MAX_DUR) * 100

  const getVal = useCallback((clientX: number) => {
    if (!trackRef.current) return 0
    const rect = trackRef.current.getBoundingClientRect()
    const frac = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return Math.round((frac * MAX_DUR) / DUR_STEP) * DUR_STEP
  }, [])

  const onMove = useCallback((clientX: number) => {
    if (!dragging.current) return
    const v = getVal(clientX)
    const [curLo, curHi] = valueRef.current
    if (dragging.current === 'lo') onChange([Math.min(v, curHi), curHi])
    else onChange([curLo, Math.max(v, curLo)])
  }, [onChange, getVal])

  const onEnd = useCallback(() => { dragging.current = null }, [])

  useEffect(() => {
    const mm = (e: MouseEvent) => onMove(e.clientX)
    const tm = (e: TouchEvent) => onMove(e.touches[0].clientX)
    window.addEventListener('mousemove', mm)
    window.addEventListener('mouseup', onEnd)
    window.addEventListener('touchmove', tm)
    window.addEventListener('touchend', onEnd)
    return () => {
      window.removeEventListener('mousemove', mm)
      window.removeEventListener('mouseup', onEnd)
      window.removeEventListener('touchmove', tm)
      window.removeEventListener('touchend', onEnd)
    }
  }, [onMove, onEnd])

  const isActive = !(lo === 0 && hi === MAX_DUR)
  const TICKS = [{ label: '0', v: 0 }, { label: '1h', v: 60 }, { label: '2h', v: 120 }, { label: '4h', v: 240 }]

  return (
    <div className="pt-1 pb-1">
      <div className="flex justify-between items-center mb-3">
        <span className={`text-xs font-semibold tabular-nums ${isActive ? 'text-[#8c2d9c]' : 'text-gray-400'}`}>{fmtMin(lo)}</span>
        <span className="text-[10px] text-gray-300">—</span>
        <span className={`text-xs font-semibold tabular-nums ${isActive ? 'text-[#8c2d9c]' : 'text-gray-400'}`}>{fmtMin(hi)}</span>
      </div>
      <div ref={trackRef} className="relative h-1.5 bg-gray-200 rounded-full mx-1.5">
        <div className="absolute h-full rounded-full bg-[#8c2d9c]"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#8c2d9c] shadow-md cursor-grab active:cursor-grabbing active:scale-110 transition-transform"
          style={{ left: `${pct(lo)}%`, zIndex: lo > MAX_DUR / 2 ? 3 : 2 }}
          onMouseDown={(e) => { e.preventDefault(); dragging.current = 'lo' }}
          onTouchStart={(e) => { e.preventDefault(); dragging.current = 'lo' }} />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#8c2d9c] shadow-md cursor-grab active:cursor-grabbing active:scale-110 transition-transform"
          style={{ left: `${pct(hi)}%`, zIndex: 2 }}
          onMouseDown={(e) => { e.preventDefault(); dragging.current = 'hi' }}
          onTouchStart={(e) => { e.preventDefault(); dragging.current = 'hi' }} />
      </div>
      <div className="relative h-4 mt-1 mx-1.5">
        {TICKS.map(({ label, v }) => (
          <span key={label} className="absolute text-[10px] text-gray-300 -translate-x-1/2 top-1" style={{ left: `${pct(v)}%` }}>
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function RecipeListPage() {
  const { isAuthenticated } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selTags, setSelTags] = useState<string[]>([])
  const [selSpecialDays, setSelSpecialDays] = useState<string[]>([])
  const [selDifficulties, setSelDifficulties] = useState<string[]>([])
  const [durRange, setDurRange] = useState<[number, number]>([0, MAX_DUR])
  const [selCountries, setSelCountries] = useState<string[]>([])
  const [region, setRegion] = useState('')
  const [selHeritages, setSelHeritages] = useState<string[]>([])
  const [applied, setApplied] = useState({
    tags: [] as string[],
    specialDays: [] as string[],
    difficulties: [] as string[],
    durRange: [0, MAX_DUR] as [number, number],
    countries: [] as string[],
    region: '',
    heritages: [] as string[],
  })

  const { data: recipes, isLoading, error } = useQuery({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
  })

  const { data: heritages = [] } = useQuery({
    queryKey: ['heritage'],
    queryFn: fetchHeritages,
  })

  useEffect(() => {
    const sdParam = searchParams.get('specialDay')
    if (sdParam) {
      setSelSpecialDays([sdParam])
      setApplied((a) => ({ ...a, specialDays: [sdParam] }))
      setSearchParams({}, { replace: true })
    }
  }, [])

  const tagOptions = useMemo(() => {
    const set = new Set<string>()
    recipes?.forEach((r) => r.tags?.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [recipes])

  const specialDayOptions = useMemo(() => [...SPECIAL_DAYS].sort(), [])

  const countryOptions = useMemo(() => {
    const set = new Set(recipes?.map((r) => r.country).filter(Boolean) as string[])
    return Array.from(set).sort()
  }, [recipes])

  const heritageOptions = useMemo(() => heritages.map((h) => h.name).sort(), [heritages])
  const heritageNameToId = useMemo(
    () => new Map(heritages.map((h) => [h.name, h.id])),
    [heritages],
  )

  const applyFilters = () => setApplied({
    tags: selTags,
    specialDays: selSpecialDays,
    difficulties: selDifficulties,
    durRange,
    countries: selCountries,
    region,
    heritages: selHeritages,
  })

  const clearFilters = () => {
    setSelTags([]); setSelSpecialDays([]); setSelDifficulties([])
    setDurRange([0, MAX_DUR]); setSelCountries([]); setRegion(''); setSelHeritages([])
    setApplied({ tags: [], specialDays: [], difficulties: [], durRange: [0, MAX_DUR], countries: [], region: '', heritages: [] })
  }

  const hasActiveFilters = applied.tags.length > 0 || applied.specialDays.length > 0 ||
    applied.difficulties.length > 0 ||
    !(applied.durRange[0] === 0 && applied.durRange[1] === MAX_DUR) ||
    applied.countries.length > 0 || applied.region || applied.heritages.length > 0

  const filtered = recipes?.filter((r) => {
    if (applied.difficulties.length > 0 && !applied.difficulties.includes(r.difficulty)) return false
    if (applied.tags.length > 0 && !applied.tags.some((t) => r.tags?.includes(t))) return false
    if (applied.specialDays.length > 0 && !applied.specialDays.some((s) => r.specialDays?.includes(s))) return false
    if (applied.countries.length > 0 && !applied.countries.includes(r.country ?? '')) return false
    const loc = `${r.country ?? ''} ${r.region ?? ''}`.toLowerCase()
    if (applied.region && !loc.includes(applied.region.toLowerCase())) return false
    if (applied.heritages.length > 0) {
      const ids = applied.heritages.map((n) => heritageNameToId.get(n)).filter(Boolean) as string[]
      if (!ids.some((id) => r.heritageIds?.includes(id))) return false
    }
    const [minD, maxD] = applied.durRange
    if (!(minD === 0 && maxD === MAX_DUR)) {
      if (r.durationMinutes == null) return false
      if (r.durationMinutes < minD || r.durationMinutes > maxD) return false
    }
    return true
  }) ?? []

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-44 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4 shadow-sm">
            <p className="font-bold text-sm text-[#171433]">Filters</p>

            {tagOptions.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tags</label>
                <SearchableCheckboxGroup
                  options={tagOptions}
                  selected={selTags}
                  onChange={setSelTags}
                  placeholder="Search tags…"
                />
              </div>
            )}

            {heritageOptions.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Heritage</label>
                <SearchableCheckboxGroup
                  options={heritageOptions}
                  selected={selHeritages}
                  onChange={setSelHeritages}
                  placeholder="Search heritage…"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Special Days</label>
              <SearchableCheckboxGroup
                options={specialDayOptions}
                selected={selSpecialDays}
                onChange={setSelSpecialDays}
                placeholder="Search special days…"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Difficulty</label>
              <CheckboxGroup
                options={DIFFICULTIES}
                selected={selDifficulties}
                onChange={setSelDifficulties}
                labelFn={(d) => DIFFICULTY_LABELS[d] ?? d}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Duration</label>
              <DualRangeSlider value={durRange} onChange={setDurRange} />
            </div>

            {countryOptions.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Country</label>
                <CheckboxGroup options={countryOptions} selected={selCountries} onChange={setSelCountries} />
              </div>
            )}

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
                  className="border border-gray-200 rounded-xl bg-white hover:border-[#8c2d9c] hover:shadow-md transition-all group overflow-hidden flex flex-col">
                  <EntityCardImage entityType="RECIPE" entityId={r.id} />
                  <div className="p-4">
                    <p className="font-bold text-sm text-[#171433] group-hover:text-[#8c2d9c] leading-snug">{r.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {r.difficulty}{r.durationMinutes ? ` · ${r.durationMinutes} min` : ''}
                    </p>
                    {(r.country || r.region) && (
                      <p className="text-xs text-[#8c2d9c] mt-1 font-medium">{[r.country, r.region].filter(Boolean).join(', ')}</p>
                    )}
                    {r.createdBy && (
                      <p className="text-xs text-gray-400 mt-2">By <Link to={`/profile/${r.createdBy}`} onClick={(e) => e.stopPropagation()} className="hover:text-[#8c2d9c] hover:underline">{r.createdBy}</Link></p>
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
