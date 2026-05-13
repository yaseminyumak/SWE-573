import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createHeritage, updateHeritage, fetchHeritage } from '../catalog/catalogApi'
import type { CreateHeritageRequest } from '../catalog/catalogApi'
import { useAuth } from '../../auth/AuthProvider'
import { COUNTRIES } from '../../shared/constants/countries'
import ImageManager from '../../shared/components/ImageManager'
import CoverPhotoPicker from '../../shared/components/CoverPhotoPicker'
import { uploadImage } from '../../shared/api/imageApi'

export default function HeritageFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { keycloak } = useAuth()

  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [description, setDescription] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)

  const { data: existing } = useQuery({
    queryKey: ['heritage', id],
    queryFn: () => fetchHeritage(id!),
    enabled: isEdit,
  })

  useEffect(() => {
    if (!existing) return
    setName(existing.name)
    setCountry(existing.country)
    setDescription(existing.description)
  }, [existing])

  const mutation = useMutation({
    mutationFn: (body: CreateHeritageRequest) =>
      isEdit ? updateHeritage(id!, body) : createHeritage(body),
    onSuccess: async (data) => {
      if (!isEdit && coverFile) {
        await uploadImage('HERITAGE', data.id, coverFile).catch(() => {})
      }
      queryClient.invalidateQueries({ queryKey: ['heritage'] })
      navigate(`/heritage/${data.id}`)
    },
  })

  const canSubmit = name.trim() && country && country !== 'Select Country' && description.trim()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    mutation.mutate({
      name: name.trim(),
      country,
      description: description.trim(),
    })
  }

  if (isEdit && existing && existing.createdBy !== keycloak?.tokenParsed?.preferred_username) {
    return <p className="text-center py-16 text-sm text-red-500">You are not allowed to edit this entry.</p>
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
      <h1 className="text-xl font-bold text-[#171433]">{isEdit ? 'Edit Heritage' : 'New Heritage'}</h1>
      <hr className="my-3 border-[#d67ec9]" />

      {isEdit && existing?.createdBy === keycloak?.tokenParsed?.preferred_username && (
        <div className="mb-6">
          <ImageManager entityType="HERITAGE" entityId={id!} canEdit={true} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isEdit && (
          <CoverPhotoPicker onChange={(f) => setCoverFile(f)} />
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter heritage name"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
          <select
            value={country || 'Select Country'}
            onChange={(e) => setCountry(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#8c2d9c]"
          >
            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            placeholder="Describe this cultural heritage"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c] resize-none"
          />
        </div>

        {mutation.isError && (
          <p className="text-sm text-red-500">Failed to save. Please try again.</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={mutation.isPending || !canSubmit}
            className="bg-[#8c2d9c] text-white rounded px-5 py-2 text-sm font-medium hover:bg-[#7a2589] disabled:opacity-50 transition-colors"
          >
            {mutation.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Heritage'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="border border-gray-300 rounded px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
