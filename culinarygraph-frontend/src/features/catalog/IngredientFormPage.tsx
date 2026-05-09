import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createIngredient, updateIngredient, fetchIngredient, fetchTechniques } from './catalogApi'
import type { CreateIngredientRequest, Season } from './catalogApi'
import RelationPicker from '../../shared/components/RelationPicker'
import ImageManager from '../../shared/components/ImageManager'
import { useAuth } from '../../auth/AuthProvider'
import { COUNTRIES } from '../../shared/constants/countries'

const ALL_SEASONS: Season[] = ['SPRING', 'SUMMER', 'FALL', 'WINTER', 'YEAR_ROUND']
const SEASON_LABELS: Record<Season, string> = {
  SPRING: 'Spring', SUMMER: 'Summer', FALL: 'Fall', WINTER: 'Winter', YEAR_ROUND: 'Year Round',
}

export default function IngredientFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { keycloak } = useAuth()

  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('')
  const [seasons, setSeasons] = useState<Season[]>([])
  const [provenanceStory, setProvenanceStory] = useState('')
  const [substitutions, setSubstitutions] = useState<string[]>([''])
  const [relatedTechniqueNames, setRelatedTechniqueNames] = useState<string[]>([])

  const { data: techniques = [] } = useQuery({ queryKey: ['catalog', 'techniques'], queryFn: fetchTechniques })
  const { data: existing } = useQuery({
    queryKey: ['catalog', 'ingredients', id],
    queryFn: () => fetchIngredient(id!),
    enabled: isEdit,
  })

  const techniqueNames = techniques.map((t) => t.name)
  const techniqueNameToId = new Map(techniques.map((t) => [t.name, t.id]))
  const techniqueIdToName = new Map(techniques.map((t) => [t.id, t.name]))

  useEffect(() => {
    if (!existing) return
    setName(existing.name)
    setCountry(existing.country ?? '')
    setRegion(existing.region ?? '')
    setSeasons((existing.seasons ?? []) as Season[])
    setProvenanceStory(existing.provenanceStory ?? '')
    setSubstitutions(existing.substitutes?.length > 0 ? existing.substitutes : [''])
    setRelatedTechniqueNames(
      (existing.relatedTechniqueIds ?? []).map((tid) => techniqueIdToName.get(tid) ?? '').filter(Boolean)
    )
  }, [existing])

  const mutation = useMutation({
    mutationFn: (body: CreateIngredientRequest) =>
      isEdit ? updateIngredient(id!, body) : createIngredient(body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['catalog', 'ingredients'] })
      navigate(isEdit ? `/catalog/ingredients/${data.id}` : '/catalog/ingredients')
    },
  })

  const addSub = () => setSubstitutions((s) => [...s, ''])
  const updateSub = (i: number, v: string) => setSubstitutions((s) => s.map((x, idx) => idx === i ? v : x))
  const removeSub = (i: number) => setSubstitutions((s) => s.filter((_, idx) => idx !== i))

  const toggleSeason = (s: Season) =>
    setSeasons((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      name: name.trim(),
      country: country && country !== 'Select Country' ? country : undefined,
      region: region.trim() || undefined,
      seasons,
      provenanceStory: provenanceStory.trim() || undefined,
      substitutes: substitutions.filter((s) => s.trim()).map((s) => s.trim()),
      relatedTechniqueIds: relatedTechniqueNames
        .map((n) => techniqueNameToId.get(n))
        .filter((tid): tid is string => tid != null),
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
      <h1 className="text-xl font-bold text-[#171433]">{isEdit ? 'Edit Ingredient' : 'New Ingredient'}</h1>
      <hr className="my-3 border-[#d67ec9]" />

      {isEdit && existing?.createdBy === keycloak?.tokenParsed?.preferred_username && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
          <ImageManager entityType="INGREDIENT" entityId={id!} canEdit={true} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
            placeholder="Enter ingredient name"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <select value={country || 'Select Country'} onChange={(e) => setCountry(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#8c2d9c]">
            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
          <input type="text" value={region} onChange={(e) => setRegion(e.target.value)}
            placeholder="e.g., Aegean Region"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Seasons</label>
          <div className="flex flex-wrap gap-3">
            {ALL_SEASONS.map((s) => (
              <label key={s} className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={seasons.includes(s)} onChange={() => toggleSeason(s)}
                  className="accent-[#8c2d9c] w-3.5 h-3.5" />
                <span className="text-sm text-gray-700">{SEASON_LABELS[s]}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Provenance Story</label>
          <textarea value={provenanceStory} onChange={(e) => setProvenanceStory(e.target.value)}
            rows={4}
            placeholder="Tell us about the origin and history of this ingredient..."
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c] resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Substitutions</label>
          <div className="space-y-2">
            {substitutions.map((sub, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={sub} onChange={(e) => updateSub(i, e.target.value)}
                  placeholder="Substitution description"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c]" />
                <button type="button" onClick={() => removeSub(i)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addSub}
            className="mt-2 border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            Add Item
          </button>
        </div>

        <RelationPicker
          label="Related Techniques"
          available={techniqueNames}
          selected={relatedTechniqueNames}
          onAdd={(n) => setRelatedTechniqueNames((s) => [...s, n])}
          onRemove={(n) => setRelatedTechniqueNames((s) => s.filter((x) => x !== n))}
        />

        {mutation.isError && (
          <p className="text-sm text-red-500">Failed to save. Please try again.</p>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={mutation.isPending || !name.trim()}
            className="bg-[#8c2d9c] text-white rounded px-5 py-2 text-sm font-medium hover:bg-[#7a2589] disabled:opacity-50 transition-colors">
            {mutation.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Ingredient'}
          </button>
          <button type="button" onClick={() => navigate(-1)}
            className="border border-gray-300 rounded px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
