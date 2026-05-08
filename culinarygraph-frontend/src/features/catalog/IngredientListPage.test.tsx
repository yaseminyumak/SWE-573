import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useQuery } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import IngredientListPage from './IngredientListPage'

vi.mock('@tanstack/react-query', () => ({ useQuery: vi.fn() }))
const authState = { isAuthenticated: false }
vi.mock('../../auth/AuthProvider', () => ({ useAuth: () => ({ isAuthenticated: authState.isAuthenticated }) }))
vi.mock('../../shared/components/EntityCardImage', () => ({
  default: ({ entityId }: any) => <div data-testid={`img-${entityId}`} />,
}))

const mockIngredients = [
  { id: '1', name: 'Saffron', country: 'Iran', region: 'Central', seasons: ['SPRING'] },
  { id: '2', name: 'Sumac', country: 'Turkey', region: 'Aegean', seasons: ['SUMMER'] },
  { id: '3', name: 'Turmeric', country: 'Iran', region: 'Southern', seasons: ['YEAR_ROUND'] },
]

const renderPage = () =>
  render(<MemoryRouter><IngredientListPage /></MemoryRouter>)

describe('IngredientListPage', () => {
  beforeEach(() => {
    authState.isAuthenticated = false
    vi.mocked(useQuery).mockReturnValue({ data: mockIngredients, isLoading: false, error: null } as any)
  })

  it('renders all ingredients when no filter is applied', () => {
    renderPage()
    expect(screen.getByText('Saffron')).toBeInTheDocument()
    expect(screen.getByText('Sumac')).toBeInTheDocument()
    expect(screen.getByText('Turmeric')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined, isLoading: true, error: null } as any)
    renderPage()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('filters by country after clicking Apply Filters', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('checkbox', { name: /iran/i }))
    await userEvent.click(screen.getByRole('button', { name: /apply filters/i }))
    expect(screen.getByText('Saffron')).toBeInTheDocument()
    expect(screen.getByText('Turmeric')).toBeInTheDocument()
    expect(screen.queryByText('Sumac')).not.toBeInTheDocument()
  })

  it('filters by region text after clicking Apply Filters', async () => {
    renderPage()
    await userEvent.type(screen.getByPlaceholderText(/aegean/i), 'Aegean')
    await userEvent.click(screen.getByRole('button', { name: /apply filters/i }))
    expect(screen.getByText('Sumac')).toBeInTheDocument()
    expect(screen.queryByText('Saffron')).not.toBeInTheDocument()
    expect(screen.queryByText('Turmeric')).not.toBeInTheDocument()
  })

  it('filters by season after clicking Apply Filters', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('checkbox', { name: /spring/i }))
    await userEvent.click(screen.getByRole('button', { name: /apply filters/i }))
    expect(screen.getByText('Saffron')).toBeInTheDocument()
    expect(screen.queryByText('Sumac')).not.toBeInTheDocument()
    expect(screen.queryByText('Turmeric')).not.toBeInTheDocument()
  })

  it('clears filters and shows all ingredients', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('checkbox', { name: /iran/i }))
    await userEvent.click(screen.getByRole('button', { name: /apply filters/i }))
    expect(screen.queryByText('Sumac')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /clear all filters/i }))
    expect(screen.getByText('Saffron')).toBeInTheDocument()
    expect(screen.getByText('Sumac')).toBeInTheDocument()
    expect(screen.getByText('Turmeric')).toBeInTheDocument()
  })

  it('shows empty state when no ingredients match filters', async () => {
    renderPage()
    await userEvent.type(screen.getByPlaceholderText(/aegean/i), 'nonexistent-region-xyz')
    await userEvent.click(screen.getByRole('button', { name: /apply filters/i }))
    expect(screen.queryByText('Saffron')).not.toBeInTheDocument()
    expect(screen.queryByText('Sumac')).not.toBeInTheDocument()
  })

  it('does not show Add Ingredient button when not authenticated', () => {
    renderPage()
    expect(screen.queryByRole('link', { name: /add ingredient/i })).not.toBeInTheDocument()
  })

  it('shows Add Ingredient button when authenticated', () => {
    authState.isAuthenticated = true
    renderPage()
    expect(screen.getByRole('link', { name: /add ingredient/i })).toBeInTheDocument()
  })
})
