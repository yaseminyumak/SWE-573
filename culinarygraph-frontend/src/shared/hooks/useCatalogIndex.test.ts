import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useQuery } from '@tanstack/react-query'
import { useCatalogIndex } from './useCatalogIndex'

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMemo: (fn: () => unknown) => fn(),
}))

vi.mock('../../features/catalog/catalogApi', () => ({
  fetchIngredients: vi.fn(),
  fetchTechniques: vi.fn(),
}))

const mockIngredients = [
  { id: 'ing-1', name: 'Saffron' },
  { id: 'ing-2', name: 'Sumac' },
]
const mockTechniques = [
  { id: 'tech-1', name: 'Blanching' },
  { id: 'tech-2', name: 'Roasting' },
]

describe('useCatalogIndex', () => {
  beforeEach(() => {
    vi.mocked(useQuery).mockImplementation(({ queryKey }: any) => {
      if (queryKey[1] === 'ingredients') return { data: mockIngredients } as any
      if (queryKey[1] === 'techniques') return { data: mockTechniques } as any
      return { data: [] } as any
    })
  })

  it('ingredientByName maps name to id', () => {
    const { result } = renderHook(() => useCatalogIndex())
    expect(result.current.ingredientByName.get('Saffron')).toBe('ing-1')
    expect(result.current.ingredientByName.get('Sumac')).toBe('ing-2')
  })

  it('techniqueByName maps name to id', () => {
    const { result } = renderHook(() => useCatalogIndex())
    expect(result.current.techniqueByName.get('Blanching')).toBe('tech-1')
    expect(result.current.techniqueByName.get('Roasting')).toBe('tech-2')
  })

  it('ingredientById maps id to name', () => {
    const { result } = renderHook(() => useCatalogIndex())
    expect(result.current.ingredientById.get('ing-1')).toBe('Saffron')
    expect(result.current.ingredientById.get('ing-2')).toBe('Sumac')
  })

  it('techniqueById maps id to name', () => {
    const { result } = renderHook(() => useCatalogIndex())
    expect(result.current.techniqueById.get('tech-1')).toBe('Blanching')
    expect(result.current.techniqueById.get('tech-2')).toBe('Roasting')
  })

  it('returns empty maps when queries return no data', () => {
    vi.mocked(useQuery).mockReturnValue({ data: [] } as any)
    const { result } = renderHook(() => useCatalogIndex())
    expect(result.current.ingredientByName.size).toBe(0)
    expect(result.current.techniqueByName.size).toBe(0)
  })
})
