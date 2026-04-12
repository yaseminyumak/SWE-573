import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchIngredients, fetchTechniques } from './catalogApi'
import { fetchRecipes } from '../recipe/recipeApi'

export default function HomePage() {
  const { data: ingredients } = useQuery({ queryKey: ['catalog', 'ingredients'], queryFn: fetchIngredients })
  const { data: techniques } = useQuery({ queryKey: ['catalog', 'techniques'], queryFn: fetchTechniques })
  const { data: recipes } = useQuery({ queryKey: ['recipes'], queryFn: fetchRecipes })

  const highlighted = [
    ...(techniques?.slice(0, 2).map((t) => ({ type: 'technique' as const, id: t.id, name: t.name, desc: t.description, location: [t.country, t.region].filter(Boolean).join(', ') })) ?? []),
    ...(ingredients?.slice(0, 1).map((i) => ({ type: 'ingredient' as const, id: i.id, name: i.name, desc: i.description, location: [i.country, i.region].filter(Boolean).join(', ') })) ?? []),
    ...(recipes?.slice(0, 1).map((r) => ({ type: 'recipe' as const, id: r.id, name: r.title, desc: r.description, location: [r.country, r.region].filter(Boolean).join(', ') })) ?? []),
  ]

  const recent = [
    ...(ingredients?.slice(0, 2).map((i) => ({ type: 'ingredient' as const, id: i.id, name: i.name, desc: i.description, location: [i.country, i.region].filter(Boolean).join(', ') })) ?? []),
    ...(techniques?.slice(0, 2).map((t) => ({ type: 'technique' as const, id: t.id, name: t.name, desc: t.description, location: [t.country, t.region].filter(Boolean).join(', ') })) ?? []),
    ...(recipes?.slice(0, 1).map((r) => ({ type: 'recipe' as const, id: r.id, name: r.title, desc: r.description, location: [r.country, r.region].filter(Boolean).join(', ') })) ?? []),
  ].slice(0, 5)

  const linkFor = (item: { type: string; id: string }) => {
    if (item.type === 'ingredient') return `/catalog/ingredients/${item.id}`
    if (item.type === 'technique') return `/catalog/techniques/${item.id}`
    return `/recipes/${item.id}`
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Knowledge Map */}
      <section>
        <h2 className="text-base font-bold text-[#171433] mb-3">Knowledge Map</h2>
        <div className="border border-[#d67ec9] rounded-lg bg-white flex items-center justify-center h-48 text-sm text-gray-400">
          Graph/network visualization placeholder (Nodes: Techniques, Ingredients, Regions)
        </div>
        <div className="mt-3 flex items-center gap-3">
          <label className="text-sm font-medium text-[#171433]">Country Filter:</label>
          <select className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-[#8c2d9c]">
            <option>All Countries</option>
          </select>
        </div>
      </section>

      {/* Highlighted Content */}
      <section>
        <h2 className="text-base font-bold text-[#171433] mb-3">Highlighted Content</h2>
        {highlighted.length === 0 ? (
          <p className="text-sm text-gray-400">No content yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {highlighted.map((item) => (
              <Link key={item.id} to={linkFor(item)}
                className="border border-gray-200 rounded-lg bg-white p-4 hover:border-[#8c2d9c] hover:shadow-sm transition-all group">
                <p className="font-bold text-sm text-[#171433] group-hover:text-[#8c2d9c] truncate">{item.name}</p>
                {item.desc && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.desc}</p>}
                {item.location && <p className="text-xs text-[#8c2d9c] mt-2 font-medium">{item.location}</p>}
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
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {recent.map((item) => (
              <Link key={item.id} to={linkFor(item)}
                className="border border-gray-200 rounded-lg bg-white p-4 hover:border-[#8c2d9c] hover:shadow-sm transition-all group">
                <p className="font-bold text-sm text-[#171433] group-hover:text-[#8c2d9c] truncate">{item.name}</p>
                {item.desc && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.desc}</p>}
                {item.location && <p className="text-xs text-[#8c2d9c] mt-2 truncate font-medium">{item.location}</p>}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
