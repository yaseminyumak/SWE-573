import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'
import { fetchIngredients, fetchTechniques, deleteIngredient, deleteTechnique } from '../catalog/catalogApi'
import { fetchRecipes, deleteRecipe } from '../recipe/recipeApi'
import ConfirmModal from '../../shared/components/ConfirmModal'
import { fetchMyLikes, fetchMyComments } from '../social/socialApi'
import { fetchProfile, updateBio } from './profileApi'

export default function ProfilePage() {
  const { keycloak, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [confirmState, setConfirmState] = useState<{ label: string; onConfirm: () => void } | null>(null)
  const [bioEditing, setBioEditing] = useState(false)
  const [bioDraft, setBioDraft] = useState('')

  const username = keycloak.tokenParsed?.preferred_username ?? keycloak.tokenParsed?.sub ?? 'User'
  const email = keycloak.tokenParsed?.email ?? ''

  const { data: ingredients } = useQuery({ queryKey: ['catalog', 'ingredients'], queryFn: fetchIngredients })
  const { data: techniques } = useQuery({ queryKey: ['catalog', 'techniques'], queryFn: fetchTechniques })
  const { data: recipes } = useQuery({ queryKey: ['recipes'], queryFn: fetchRecipes })
  const { data: myLikes = [] } = useQuery({ queryKey: ['likes', 'mine'], queryFn: fetchMyLikes })
  const { data: myComments = [] } = useQuery({ queryKey: ['comments', 'mine'], queryFn: fetchMyComments })
  const { data: profileData } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => fetchProfile(username),
    enabled: !!username,
  })

  const saveBioMutation = useMutation({
    mutationFn: (bio: string) => updateBio(bio),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] })
      setBioEditing(false)
    },
  })

  const delIngredient = useMutation({
    mutationFn: (id: string) => deleteIngredient(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['catalog', 'ingredients'] }),
  })
  const delTechnique = useMutation({
    mutationFn: (id: string) => deleteTechnique(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['catalog', 'techniques'] }),
  })
  const delRecipe = useMutation({
    mutationFn: (id: string) => deleteRecipe(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recipes'] }),
  })

  const confirmDelete = (label: string, onConfirm: () => void) => {
    setConfirmState({ label, onConfirm })
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-sm text-gray-500">You need to be logged in to view your profile.</p>
      </div>
    )
  }

  const myTechniques = techniques?.filter((t) => t.createdBy === username) ?? []
  const myIngredients = ingredients?.filter((i) => i.createdBy === username) ?? []
  const myRecipes = recipes?.filter((r) => r.createdBy === username) ?? []

  const likedRecipes = myLikes
    .filter((l) => l.entityType === 'RECIPE')
    .map((l) => recipes?.find((r) => r.id === l.entityId))
    .filter(Boolean)
  const likedIngredients = myLikes
    .filter((l) => l.entityType === 'INGREDIENT')
    .map((l) => ingredients?.find((i) => i.id === l.entityId))
    .filter(Boolean)
  const likedTechniques = myLikes
    .filter((l) => l.entityType === 'TECHNIQUE')
    .map((l) => techniques?.find((t) => t.id === l.entityId))
    .filter(Boolean)

  return (
    <>
    {confirmState && (
      <ConfirmModal
        label={confirmState.label}
        onConfirm={() => { confirmState.onConfirm(); setConfirmState(null) }}
        onCancel={() => setConfirmState(null)}
      />
    )}
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

      {/* Bio */}
      <div className="border border-[#d67ec9] rounded-lg p-5 mb-8 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-sm text-[#171433]">Bio</p>
          {!bioEditing && (
            <button
              onClick={() => { setBioDraft(profileData?.bio ?? ''); setBioEditing(true) }}
              className="text-xs font-medium text-[#8c2d9c] hover:text-[#7a2589] border border-[#d67ec9] rounded px-3 py-1 hover:border-[#8c2d9c] transition-colors"
            >
              Edit Bio
            </button>
          )}
        </div>

        {bioEditing ? (
          <div className="space-y-3">
            <textarea
              value={bioDraft}
              onChange={(e) => setBioDraft(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="Tell others about your culinary background, interests, or what you contribute to CulinaryGraph…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c] focus:ring-1 focus:ring-[#8c2d9c] resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{bioDraft.length}/500</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setBioEditing(false)}
                  className="text-xs font-medium text-gray-500 border border-gray-300 rounded px-3 py-1.5 hover:border-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveBioMutation.mutate(bioDraft)}
                  disabled={saveBioMutation.isPending}
                  className="text-xs font-medium text-white bg-[#8c2d9c] rounded px-4 py-1.5 hover:bg-[#7a2589] transition-colors disabled:opacity-50"
                >
                  {saveBioMutation.isPending ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {profileData?.bio || <span className="text-gray-400 italic">No bio added yet.</span>}
          </p>
        )}
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
                    onClick={() => navigate(`/catalog/techniques/${t.id}/edit`)}
                    className="border border-gray-300 rounded px-3 py-1 text-xs font-medium text-gray-700 hover:border-[#8c2d9c] hover:text-[#8c2d9c] transition-colors"
                  >Edit</button>
                  <button
                    onClick={() => confirmDelete(t.name, () => delTechnique.mutate(t.id))}
                    disabled={delTechnique.isPending}
                    className="border border-gray-300 rounded px-3 py-1 text-xs font-medium text-gray-700 hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  >Delete</button>
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
                    onClick={() => navigate(`/catalog/ingredients/${ing.id}/edit`)}
                    className="border border-gray-300 rounded px-3 py-1 text-xs font-medium text-gray-700 hover:border-[#8c2d9c] hover:text-[#8c2d9c] transition-colors"
                  >Edit</button>
                  <button
                    onClick={() => confirmDelete(ing.name, () => delIngredient.mutate(ing.id))}
                    disabled={delIngredient.isPending}
                    className="border border-gray-300 rounded px-3 py-1 text-xs font-medium text-gray-700 hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  >Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* My Activity */}
      <section className="mb-8">
        <h2 className="font-bold text-base text-[#171433] mb-3">My Activity</h2>

        {(likedRecipes.length > 0 || likedIngredients.length > 0 || likedTechniques.length > 0) && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Liked Content</p>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white shadow-sm overflow-hidden">
              {likedRecipes.map((r) => r && (
                <Link key={r.id} to={`/recipes/${r.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-[#ede8ee] transition-colors">
                  <span className="text-xs bg-[#ede8ee] text-[#8c2d9c] px-2 py-0.5 rounded font-medium flex-shrink-0">Recipe</span>
                  <span className="text-sm text-gray-700 truncate">{r.title}</span>
                </Link>
              ))}
              {likedIngredients.map((i) => i && (
                <Link key={i.id} to={`/catalog/ingredients/${i.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-[#ede8ee] transition-colors">
                  <span className="text-xs bg-[#ede8ee] text-[#8c2d9c] px-2 py-0.5 rounded font-medium flex-shrink-0">Ingredient</span>
                  <span className="text-sm text-gray-700 truncate">{i.name}</span>
                </Link>
              ))}
              {likedTechniques.map((t) => t && (
                <Link key={t.id} to={`/catalog/techniques/${t.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-[#ede8ee] transition-colors">
                  <span className="text-xs bg-[#ede8ee] text-[#8c2d9c] px-2 py-0.5 rounded font-medium flex-shrink-0">Technique</span>
                  <span className="text-sm text-gray-700 truncate">{t.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {myComments.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Recent Comments</p>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white shadow-sm overflow-hidden">
              {myComments.slice(0, 5).map((c) => (
                <div key={c.id} className="px-4 py-2.5">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs bg-[#ede8ee] text-[#8c2d9c] px-2 py-0.5 rounded font-medium">{c.username}</span>
                    <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-1">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {likedRecipes.length === 0 && likedIngredients.length === 0 && likedTechniques.length === 0 && myComments.length === 0 && (
          <p className="text-sm text-gray-400">No activity yet.</p>
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
                    onClick={() => navigate(`/recipes/${r.id}/edit`)}
                    className="border border-gray-300 rounded px-3 py-1 text-xs font-medium text-gray-700 hover:border-[#8c2d9c] hover:text-[#8c2d9c] transition-colors"
                  >Edit</button>
                  <button
                    onClick={() => confirmDelete(r.title, () => delRecipe.mutate(r.id))}
                    disabled={delRecipe.isPending}
                    className="border border-gray-300 rounded px-3 py-1 text-xs font-medium text-gray-700 hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  >Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
    </>
  )
}
