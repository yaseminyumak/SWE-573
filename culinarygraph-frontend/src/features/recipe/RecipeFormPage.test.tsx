import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import RecipeFormPage from './RecipeFormPage'

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom') as any
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({}),
  }
})

vi.mock('../../auth/AuthProvider', () => ({
  useAuth: () => ({ keycloak: { subject: 'test-user-id' } }),
}))

vi.mock('../../shared/constants/countries', () => ({
  COUNTRIES: ['Select Country', 'Italy', 'France', 'Japan'],
}))

const mockTechniques = [
  { id: 'tech-1', name: 'Blanching' },
  { id: 'tech-2', name: 'Sautéing' },
]
const mockIngredients = [
  { id: 'ing-1', name: 'Pasta' },
  { id: 'ing-2', name: 'Eggs' },
]

const renderPage = () =>
  render(<MemoryRouter><RecipeFormPage /></MemoryRouter>)

describe('RecipeFormPage — create mode', () => {
  beforeEach(() => {
    vi.mocked(useQuery).mockImplementation(({ queryKey }: any) => {
      if (queryKey[1] === 'techniques') return { data: mockTechniques } as any
      if (queryKey[1] === 'ingredients') return { data: mockIngredients } as any
      return { data: undefined } as any
    })
    vi.mocked(useMutation).mockReturnValue({ mutate: vi.fn(), isPending: false, isError: false } as any)
    vi.mocked(useQueryClient).mockReturnValue({ invalidateQueries: vi.fn() } as any)
  })

  it('renders "New Recipe" heading', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /new recipe/i })).toBeInTheDocument()
  })

  it('renders the Title input', () => {
    renderPage()
    expect(screen.getByPlaceholderText(/enter recipe title/i)).toBeInTheDocument()
  })

  it('renders difficulty selector with EASY, MEDIUM, HARD options', () => {
    renderPage()
    expect(screen.getByRole('option', { name: 'EASY' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'MEDIUM' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'HARD' })).toBeInTheDocument()
  })

  it('renders one step input by default', () => {
    renderPage()
    expect(screen.getAllByPlaceholderText(/step description/i)).toHaveLength(1)
  })

  it('adds a step input when "Add Step" is clicked', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /add step/i }))
    expect(screen.getAllByPlaceholderText(/step description/i)).toHaveLength(2)
  })

  it('removes a step input when "Remove" is clicked', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /add step/i }))
    expect(screen.getAllByPlaceholderText(/step description/i)).toHaveLength(2)
    const removeButtons = screen.getAllByRole('button', { name: /^remove$/i })
    // ingredient Remove buttons come first; step Remove buttons are last
    await userEvent.click(removeButtons[removeButtons.length - 1])
    expect(screen.getAllByPlaceholderText(/step description/i)).toHaveLength(1)
  })

  it('renders one ingredient row by default', () => {
    renderPage()
    const ingredientSelects = screen.getAllByRole('combobox')
    expect(ingredientSelects.some(s =>
      Array.from(s.querySelectorAll('option')).some(o => o.textContent === 'Pasta')
    )).toBe(true)
  })

  it('adds an ingredient row when "Add Ingredient" is clicked', async () => {
    renderPage()
    const initialSelects = screen.getAllByRole('combobox').length
    await userEvent.click(screen.getByRole('button', { name: /add ingredient/i }))
    expect(screen.getAllByRole('combobox').length).toBeGreaterThan(initialSelects)
  })

  it('removes an ingredient row when "Remove" is clicked', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /add ingredient/i }))
    const countBefore = screen.getAllByRole('combobox').length
    const removeButtons = screen.getAllByRole('button', { name: /^remove$/i })
    await userEvent.click(removeButtons[0])
    expect(screen.getAllByRole('combobox').length).toBeLessThan(countBefore)
  })

  it('shows catalog techniques in the RelationPicker', () => {
    renderPage()
    expect(screen.getByRole('option', { name: 'Blanching' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Sautéing' })).toBeInTheDocument()
  })

  it('adds a technique chip when selected from RelationPicker', async () => {
    renderPage()
    const techniqueCombobox = screen.getAllByRole('combobox').find(
      (s) => Array.from(s.querySelectorAll('option')).some((o) => o.textContent === 'Blanching')
    )!
    await userEvent.selectOptions(techniqueCombobox, 'Blanching')
    expect(screen.getByText('Blanching')).toBeInTheDocument()
  })

  it('removes a technique chip when × button is clicked', async () => {
    renderPage()
    const techniqueCombobox = screen.getAllByRole('combobox').find(
      (s) => Array.from(s.querySelectorAll('option')).some((o) => o.textContent === 'Blanching')
    )!
    await userEvent.selectOptions(techniqueCombobox, 'Blanching')
    await userEvent.click(screen.getByRole('button', { name: /remove blanching/i }))
    expect(screen.queryByRole('button', { name: /remove blanching/i })).not.toBeInTheDocument()
  })

  it('disables submit button when title is empty', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /create recipe/i })).toBeDisabled()
  })

  it('enables submit button when title is typed', async () => {
    renderPage()
    await userEvent.type(screen.getByPlaceholderText(/enter recipe title/i), 'Pasta Carbonara')
    expect(screen.getByRole('button', { name: /create recipe/i })).not.toBeDisabled()
  })

  it('renders Tags and Origin Story fields', () => {
    renderPage()
    expect(screen.getByPlaceholderText(/vegetarian, italian, quick/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/share the story/i)).toBeInTheDocument()
  })
})
