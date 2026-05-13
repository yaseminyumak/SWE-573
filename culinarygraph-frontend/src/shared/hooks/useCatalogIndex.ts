import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchIngredients, fetchTechniques, fetchHeritages } from '../../features/catalog/catalogApi'

/** Returns name→id and id→name maps for ingredients, techniques, and heritage entries. */
export function useCatalogIndex() {
  const { data: ingredients = [] } = useQuery({ queryKey: ['catalog', 'ingredients'], queryFn: fetchIngredients })
  const { data: techniques = [] } = useQuery({ queryKey: ['catalog', 'techniques'], queryFn: fetchTechniques })
  const { data: heritages = [] } = useQuery({ queryKey: ['heritage'], queryFn: fetchHeritages })

  const ingredientByName = useMemo(
    () => new Map(ingredients.map((i) => [i.name, i.id])),
    [ingredients],
  )
  const techniqueByName = useMemo(
    () => new Map(techniques.map((t) => [t.name, t.id])),
    [techniques],
  )
  const ingredientById = useMemo(
    () => new Map(ingredients.map((i) => [i.id, i.name])),
    [ingredients],
  )
  const techniqueById = useMemo(
    () => new Map(techniques.map((t) => [t.id, t.name])),
    [techniques],
  )
  const heritageById = useMemo(
    () => new Map(heritages.map((h) => [h.id, h.name])),
    [heritages],
  )

  return { ingredientByName, techniqueByName, ingredientById, techniqueById, heritageById }
}
