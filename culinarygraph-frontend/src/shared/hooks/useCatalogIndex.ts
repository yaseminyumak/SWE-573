import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchIngredients, fetchTechniques } from '../../features/catalog/catalogApi'

/** Returns name→id maps for ingredients and techniques, resolved from cached catalog queries. */
export function useCatalogIndex() {
  const { data: ingredients = [] } = useQuery({ queryKey: ['catalog', 'ingredients'], queryFn: fetchIngredients })
  const { data: techniques = [] } = useQuery({ queryKey: ['catalog', 'techniques'], queryFn: fetchTechniques })

  const ingredientByName = useMemo(
    () => new Map(ingredients.map((i) => [i.name, i.id])),
    [ingredients],
  )
  const techniqueByName = useMemo(
    () => new Map(techniques.map((t) => [t.name, t.id])),
    [techniques],
  )

  return { ingredientByName, techniqueByName }
}
