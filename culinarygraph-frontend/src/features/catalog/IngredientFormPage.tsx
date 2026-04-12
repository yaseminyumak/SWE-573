import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createIngredient, fetchTechniques } from './catalogApi'
import type { CreateIngredientRequest } from './catalogApi'
import RelationPicker from '../../shared/components/RelationPicker'

const COUNTRIES = ['Select Country', 'France', 'Italy', 'Turkey', 'Japan', 'Mexico', 'India', 'China', 'United States', 'Spain', 'Greece', 'Morocco', 'Thailand', 'Korea', 'Other']

export default function IngredientFormPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('')
  const [seasonality, setSeasonality] = useState('')
  const [provenanceStory, setProvenanceStory] = useState('')
  const [substitutions, setSubstitutions] = useState<string[]>([''])
  const [relatedTechniqueNames, setRelatedTechniqueNames] = useState<string[]>([])

  const { data: techniques = [] } = useQuery({ queryKey: ['catalog', 'techniques'], queryFn: fetchTechniques })
  const techniqueNames = techniques.map((t) => t.name)

  const mutation = useMutation({
    mutationFn: (body: CreateIngredientRequest) => createIngredient(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog', 'ingredients'] })
      navigate('/catalog/ingredients')
    },
  })

  const addSub = () => setSubstitutions((s) => [...s, ''])
  const updateSub = (i: number, v: string) => setSubstitutions((s) => s.map((x, idx) => idx === i ? v : x))
  const removeSub = (i: number) => setSubstitutions((s) => s.filter((_, idx) => idx !== i))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      name: name.trim(),
      country: country && country !== 'Select Country' ? country : undefined,
      region: region.trim() || undefined,
      seasonality: seasonality.trim() || undefined,
      provenanceStory: provenanceStory.trim() || undefined,
      substitutes: substitutions.filter((s) => s.trim()).map((s) => s.trim()),
      relatedTechniqueNames,
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
      <h1 className="text-xl font-bold text-[#171433]">Add / Edit Ingredient</h1>
      <hr className="my-3 border-[#d67ec9]" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter ingredient name"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
          <select
            value={country || 'Select Country'}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#8c2d9c]"
          >
            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="e.g., Aegean Region"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seasonality</label>
          <input
            type="text"
            value={seasonality}
            onChange={(e) => setSeasonality(e.target.value)}
            placeholder="e.g., Summer, All Year"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Provenance Story (optional)</label>
          <textarea
            value={provenanceStory}
            onChange={(e) => setProvenanceStory(e.target.value)}
            rows={4}
            placeholder="Tell us about the origin and history of this ingredient..."
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c] resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Substitutions</label>
          <div className="space-y-2">
            {substitutions.map((sub, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={sub}
                  onChange={(e) => updateSub(i, e.target.value)}
                  placeholder="Substitution description"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c]"
                />
                <button
                  type="button"
                  onClick={() => removeSub(i)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addSub}
            className="mt-2 border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
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

        <div>
          <button
            type="submit"
            disabled={mutation.isPending || !name.trim()}
            className="bg-[#8c2d9c] text-white rounded px-5 py-2 text-sm font-medium hover:bg-[#7a2589] disabled:opacity-50 transition-colors"
          >
            {mutation.isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
