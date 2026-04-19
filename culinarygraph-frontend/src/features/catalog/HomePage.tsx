import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { fetchIngredients, fetchTechniques } from './catalogApi'
import { fetchRecipes } from '../recipe/recipeApi'
import EntityCardImage from '../../shared/components/EntityCardImage'

type ItemType = 'recipe' | 'ingredient' | 'technique'
interface CardItem { type: ItemType; id: string; name: string; desc: string; location: string }

export default function HomePage() {
  const [selectedCountry, setSelectedCountry] = useState('')

  const { data: ingredients } = useQuery({ queryKey: ['catalog', 'ingredients'], queryFn: fetchIngredients })
  const { data: techniques } = useQuery({ queryKey: ['catalog', 'techniques'], queryFn: fetchTechniques })
  const { data: recipes } = useQuery({ queryKey: ['recipes'], queryFn: fetchRecipes })

  const countries = useMemo(() => {
    const set = new Set([
      ...(ingredients?.map((i) => i.country).filter(Boolean) ?? []),
      ...(techniques?.map((t) => t.country).filter(Boolean) ?? []),
      ...(recipes?.map((r) => r.country).filter(Boolean) ?? []),
    ] as string[])
    return Array.from(set).sort()
  }, [ingredients, techniques, recipes])

  const toItem = (type: ItemType, id: string, name: string, desc: string, country?: string | null, region?: string | null) =>
    ({ type, id, name, desc, location: [country, region].filter(Boolean).join(', ') })

  const highlighted: CardItem[] = [
    ...(techniques?.slice(0, 2).map((t) => toItem('technique', t.id, t.name, t.description ?? '', t.country, t.region)) ?? []),
    ...(ingredients?.slice(0, 1).map((i) => toItem('ingredient', i.id, i.name, i.description ?? '', i.country, i.region)) ?? []),
    ...(recipes?.slice(0, 1).map((r) => toItem('recipe', r.id, r.title, r.description ?? '', r.country, r.region)) ?? []),
  ]

  const recent: CardItem[] = [
    ...(ingredients?.slice(0, 2).map((i) => toItem('ingredient', i.id, i.name, i.description ?? '', i.country, i.region)) ?? []),
    ...(techniques?.slice(0, 2).map((t) => toItem('technique', t.id, t.name, t.description ?? '', t.country, t.region)) ?? []),
    ...(recipes?.slice(0, 1).map((r) => toItem('recipe', r.id, r.title, r.description ?? '', r.country, r.region)) ?? []),
  ].slice(0, 5)

  const linkFor = (item: CardItem) => {
    if (item.type === 'ingredient') return `/catalog/ingredients/${item.id}`
    if (item.type === 'technique') return `/catalog/techniques/${item.id}`
    return `/recipes/${item.id}`
  }

  const entityType = (type: ItemType) => type.toUpperCase() as 'RECIPE' | 'INGREDIENT' | 'TECHNIQUE'

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">

      {/* Knowledge Map */}
      <section>
        <h2 className="text-base font-bold text-[#171433] mb-3">Knowledge Map</h2>
        <div className="border border-[#d67ec9] rounded-xl bg-white flex items-center justify-center h-48 text-sm text-gray-400">
          Graph/network visualization placeholder (Nodes: Techniques, Ingredients, Regions)
        </div>
        <div className="mt-3 flex items-center gap-3">
          <label className="text-sm font-medium text-[#171433]">Country Filter:</label>
          <select
            value={selectedCountry || 'All Countries'}
            onChange={(e) => setSelectedCountry(e.target.value === 'All Countries' ? '' : e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-[#8c2d9c]"
          >
            <option>All Countries</option>
            {countries.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </section>

      {/* Highlighted Content */}
      <section>
        <h2 className="text-base font-bold text-[#171433] mb-3">Highlighted Content</h2>
        {highlighted.length === 0 ? (
          <p className="text-sm text-gray-400">No content yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {highlighted.map((item) => (
              <Link key={item.id} to={linkFor(item)}
                className="border border-gray-200 rounded-xl bg-white hover:border-[#8c2d9c] hover:shadow-md transition-all group overflow-hidden flex flex-col">
                <EntityCardImage entityType={entityType(item.type)} entityId={item.id} />
                <div className="p-3">
                  <p className="font-bold text-sm text-[#171433] group-hover:text-[#8c2d9c] truncate leading-snug">{item.name}</p>
                  {item.location && <p className="text-xs text-[#8c2d9c] mt-1 font-medium truncate">{item.location}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recently Added */}
      <section>
        <h2 className="text-base font-bold text-[#171433] mb-3">Recently Added</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-gray-400">No items yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {recent.map((item) => (
              <Link key={item.id} to={linkFor(item)}
                className="border border-gray-200 rounded-xl bg-white hover:border-[#8c2d9c] hover:shadow-md transition-all group overflow-hidden flex flex-col">
                <EntityCardImage entityType={entityType(item.type)} entityId={item.id} />
                <div className="p-3">
                  <p className="font-bold text-sm text-[#171433] group-hover:text-[#8c2d9c] truncate leading-snug">{item.name}</p>
                  {item.location && <p className="text-xs text-[#8c2d9c] mt-1 truncate font-medium">{item.location}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
