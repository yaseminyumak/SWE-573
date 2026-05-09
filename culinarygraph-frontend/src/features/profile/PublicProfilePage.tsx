import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchProfile } from './profileApi'
import { fetchIngredients, fetchTechniques } from '../catalog/catalogApi'
import { fetchRecipes } from '../recipe/recipeApi'

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => fetchProfile(username!),
    enabled: !!username,
  })
  const { data: ingredients } = useQuery({ queryKey: ['catalog', 'ingredients'], queryFn: fetchIngredients })
  const { data: techniques } = useQuery({ queryKey: ['catalog', 'techniques'], queryFn: fetchTechniques })
  const { data: recipes } = useQuery({ queryKey: ['recipes'], queryFn: fetchRecipes })

  if (isLoading) return null

  const theirIngredients = ingredients?.filter((i) => i.createdBy === username) ?? []
  const theirTechniques = techniques?.filter((t) => t.createdBy === username) ?? []
  const theirRecipes = recipes?.filter((r) => r.createdBy === username) ?? []
  const totalContributions = theirIngredients.length + theirTechniques.length + theirRecipes.length

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-[#171433]">{username}</h1>
      <hr className="my-4 border-[#d67ec9]" />

      {/* Bio */}
      <div className="border border-[#d67ec9] rounded-lg p-5 mb-8 bg-white shadow-sm">
        <p className="font-bold text-sm text-[#171433] mb-3">About</p>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">
          {profile?.bio
            ? profile.bio
            : <span className="text-gray-400 italic">No bio added yet.</span>}
        </p>
        {totalContributions > 0 && (
          <p className="text-xs text-[#8c2d9c] mt-3 font-medium">
            {totalContributions} contribution{totalContributions !== 1 ? 's' : ''} to CulinaryGraph
          </p>
        )}
      </div>

      {/* Contributions */}
      {theirRecipes.length > 0 && (
        <section className="mb-6">
          <h2 className="font-bold text-sm text-[#171433] uppercase tracking-wider mb-2">Recipes</h2>
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white shadow-sm overflow-hidden">
            {theirRecipes.map((r) => (
              <Link key={r.id} to={`/recipes/${r.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#fdf8ff] transition-colors group">
                <span className="text-sm font-medium text-[#171433] group-hover:text-[#8c2d9c] truncate">{r.title}</span>
                {r.country && <span className="text-xs text-gray-400 ml-auto flex-shrink-0">{r.country}</span>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {theirIngredients.length > 0 && (
        <section className="mb-6">
          <h2 className="font-bold text-sm text-[#171433] uppercase tracking-wider mb-2">Ingredients</h2>
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white shadow-sm overflow-hidden">
            {theirIngredients.map((i) => (
              <Link key={i.id} to={`/catalog/ingredients/${i.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#fdf8ff] transition-colors group">
                <span className="text-sm font-medium text-[#171433] group-hover:text-[#8c2d9c] truncate">{i.name}</span>
                {i.country && <span className="text-xs text-gray-400 ml-auto flex-shrink-0">{i.country}</span>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {theirTechniques.length > 0 && (
        <section className="mb-6">
          <h2 className="font-bold text-sm text-[#171433] uppercase tracking-wider mb-2">Techniques</h2>
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white shadow-sm overflow-hidden">
            {theirTechniques.map((t) => (
              <Link key={t.id} to={`/catalog/techniques/${t.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#fdf8ff] transition-colors group">
                <span className="text-sm font-medium text-[#171433] group-hover:text-[#8c2d9c] truncate">{t.name}</span>
                {t.country && <span className="text-xs text-gray-400 ml-auto flex-shrink-0">{t.country}</span>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {totalContributions === 0 && (
        <p className="text-sm text-gray-400">No contributions yet.</p>
      )}
    </div>
  )
}
