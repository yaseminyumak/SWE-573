import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchIngredients, fetchTechniques } from './catalogApi'
import { fetchRecipes } from '../recipe/recipeApi'
import EntityCardImage from '../../shared/components/EntityCardImage'
import SocialCounts from '../social/SocialCounts'
import WorldMapSection from './WorldMapSection'

type ItemType = 'recipe' | 'ingredient' | 'technique'
interface CardItem { type: ItemType; id: string; name: string; desc: string; location: string }

export default function HomePage() {
  const { data: ingredients } = useQuery({ queryKey: ['catalog', 'ingredients'], queryFn: fetchIngredients, staleTime: 0 })
  const { data: techniques } = useQuery({ queryKey: ['catalog', 'techniques'], queryFn: fetchTechniques, staleTime: 0 })
  const { data: recipes } = useQuery({ queryKey: ['recipes'], queryFn: fetchRecipes, staleTime: 0 })

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

      {/* World Food Map */}
      <WorldMapSection
        recipes={recipes ?? []}
        ingredients={ingredients ?? []}
        techniques={techniques ?? []}
      />

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
                  <SocialCounts entityType={entityType(item.type)} entityId={item.id} />
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
                  <SocialCounts entityType={entityType(item.type)} entityId={item.id} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
