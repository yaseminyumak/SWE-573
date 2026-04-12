import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'
import { fetchIngredients, fetchTechniques } from '../catalog/catalogApi'
import { fetchRecipes } from '../recipe/recipeApi'

export default function ProfilePage() {
  const { keycloak, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const userId = keycloak.subject
  const username = keycloak.tokenParsed?.preferred_username ?? keycloak.tokenParsed?.sub ?? 'User'
  const email = keycloak.tokenParsed?.email ?? ''

  const { data: ingredients } = useQuery({ queryKey: ['catalog', 'ingredients'], queryFn: fetchIngredients })
  const { data: techniques } = useQuery({ queryKey: ['catalog', 'techniques'], queryFn: fetchTechniques })
  const { data: recipes } = useQuery({ queryKey: ['recipes'], queryFn: fetchRecipes })

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-sm text-gray-500">You need to be logged in to view your profile.</p>
      </div>
    )
  }

  const myTechniques = techniques?.filter((t) => t.createdBy === userId) ?? []
  const myIngredients = ingredients?.filter((i) => i.createdBy === userId) ?? []
  const myRecipes = recipes?.filter((r) => r.createdBy === userId) ?? []

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-[#171433]">Profile</h1>
      <hr className="my-4 border-[#d67ec9]" />

      {/* User Information */}
      <div className="border border-[#d67ec9] rounded-lg p-5 mb-8 bg-white shadow-sm">
        <p className="font-bold text-sm text-[#171433] mb-3">User Information</p>
        <div className="space-y-1">
          <p className="text-sm text-gray-700"><span className="font-semibold text-[#171433]">Username:</span> {username}</p>
          {email && <p className="text-sm text-gray-700"><span className="font-semibold text-[#171433]">Email:</span> {email}</p>}
          <p className="text-sm text-gray-700"><span className="font-semibold text-[#171433]">Role:</span> Contributor</p>
        </div>
      </div>

      {/* My Techniques */}
      <section className="mb-8">
        <h2 className="font-bold text-base text-[#171433] mb-3">My Techniques</h2>
        {myTechniques.length === 0 ? (
          <p className="text-sm text-gray-400">No techniques added yet.</p>
        ) : (
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white shadow-sm overflow-hidden">
            {myTechniques.map((t, i) => (
              <div key={t.id} className="flex items-center justify-between px-4 py-3 hover:bg-[#ede8ee] transition-colors">
                <span className="text-sm text-gray-700">Technique {i + 1}: <span className="font-medium">{t.name}</span></span>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/catalog/techniques/${t.id}`)}
                    className="border border-gray-300 rounded px-3 py-1 text-xs font-medium text-gray-700 hover:border-[#8c2d9c] hover:text-[#8c2d9c] transition-colors"
                  >Edit</button>
                  <button className="border border-gray-300 rounded px-3 py-1 text-xs font-medium text-gray-700 hover:border-red-400 hover:text-red-500 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* My Ingredients */}
      <section className="mb-8">
        <h2 className="font-bold text-base text-[#171433] mb-3">My Ingredients</h2>
        {myIngredients.length === 0 ? (
          <p className="text-sm text-gray-400">No ingredients added yet.</p>
        ) : (
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white shadow-sm overflow-hidden">
            {myIngredients.map((ing, i) => (
              <div key={ing.id} className="flex items-center justify-between px-4 py-3 hover:bg-[#ede8ee] transition-colors">
                <span className="text-sm text-gray-700">Ingredient {i + 1}: <span className="font-medium">{ing.name}</span></span>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/catalog/ingredients/${ing.id}`)}
                    className="border border-gray-300 rounded px-3 py-1 text-xs font-medium text-gray-700 hover:border-[#8c2d9c] hover:text-[#8c2d9c] transition-colors"
                  >Edit</button>
                  <button className="border border-gray-300 rounded px-3 py-1 text-xs font-medium text-gray-700 hover:border-red-400 hover:text-red-500 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* My Recipes */}
      <section>
        <h2 className="font-bold text-base text-[#171433] mb-3">My Recipes</h2>
        {myRecipes.length === 0 ? (
          <p className="text-sm text-gray-400">No recipes added yet.</p>
        ) : (
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white shadow-sm overflow-hidden">
            {myRecipes.map((r, i) => (
              <div key={r.id} className="flex items-center justify-between px-4 py-3 hover:bg-[#ede8ee] transition-colors">
                <span className="text-sm text-gray-700">Recipe {i + 1}: <span className="font-medium">{r.title}</span></span>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/recipes/${r.id}`)}
                    className="border border-gray-300 rounded px-3 py-1 text-xs font-medium text-gray-700 hover:border-[#8c2d9c] hover:text-[#8c2d9c] transition-colors"
                  >Edit</button>
                  <button className="border border-gray-300 rounded px-3 py-1 text-xs font-medium text-gray-700 hover:border-red-400 hover:text-red-500 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
