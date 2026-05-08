import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useQuery } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import RecipeListPage from './RecipeListPage'

vi.mock('@tanstack/react-query', () => ({ useQuery: vi.fn() }))
vi.mock('../../auth/AuthProvider', () => ({ useAuth: () => ({ isAuthenticated: false }) }))
vi.mock('../../shared/components/EntityCardImage', () => ({
  default: () => <div data-testid="card-img" />,
}))

const mockRecipes = [
  { id: '1', name: 'Pasta Carbonara', title: 'Pasta Carbonara', difficulty: 'EASY', durationMinutes: 30, country: 'Italy', region: 'Lazio', tags: ['Italian', 'Quick'] },
  { id: '2', name: 'Beef Bourguignon', title: 'Beef Bourguignon', difficulty: 'HARD', durationMinutes: 180, country: 'France', region: 'Burgundy', tags: ['French', 'Slow'] },
  { id: '3', name: 'Sushi', title: 'Sushi', difficulty: 'MEDIUM', durationMinutes: 60, country: 'Japan', region: 'Tokyo', tags: ['Japanese', 'Raw'] },
]

const renderPage = () =>
  render(<MemoryRouter><RecipeListPage /></MemoryRouter>)

describe('RecipeListPage', () => {
  beforeEach(() => {
    vi.mocked(useQuery).mockReturnValue({ data: mockRecipes, isLoading: false, error: null } as any)
  })

  it('renders all recipes when no filter is applied', () => {
    renderPage()
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
    expect(screen.getByText('Beef Bourguignon')).toBeInTheDocument()
    expect(screen.getByText('Sushi')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined, isLoading: true, error: null } as any)
    renderPage()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('filters by difficulty after clicking Apply Filters', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('checkbox', { name: /hard/i }))
    await userEvent.click(screen.getByRole('button', { name: /apply filters/i }))
    expect(screen.getByText('Beef Bourguignon')).toBeInTheDocument()
    expect(screen.queryByText('Pasta Carbonara')).not.toBeInTheDocument()
    expect(screen.queryByText('Sushi')).not.toBeInTheDocument()
  })

  it('filters by country after clicking Apply Filters', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('checkbox', { name: /japan/i }))
    await userEvent.click(screen.getByRole('button', { name: /apply filters/i }))
    expect(screen.getByText('Sushi')).toBeInTheDocument()
    expect(screen.queryByText('Pasta Carbonara')).not.toBeInTheDocument()
    expect(screen.queryByText('Beef Bourguignon')).not.toBeInTheDocument()
  })

  it('filters by tag search after clicking Apply Filters', async () => {
    renderPage()
    await userEvent.type(screen.getByPlaceholderText(/vegetarian/i), 'Quick')
    await userEvent.click(screen.getByRole('button', { name: /apply filters/i }))
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
    expect(screen.queryByText('Beef Bourguignon')).not.toBeInTheDocument()
    expect(screen.queryByText('Sushi')).not.toBeInTheDocument()
  })

  it('filters by region text after clicking Apply Filters', async () => {
    renderPage()
    await userEvent.type(screen.getByPlaceholderText(/aegean/i), 'Burgundy')
    await userEvent.click(screen.getByRole('button', { name: /apply filters/i }))
    expect(screen.getByText('Beef Bourguignon')).toBeInTheDocument()
    expect(screen.queryByText('Pasta Carbonara')).not.toBeInTheDocument()
  })

  it('clears filters and shows all recipes', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('checkbox', { name: /hard/i }))
    await userEvent.click(screen.getByRole('button', { name: /apply filters/i }))
    expect(screen.queryByText('Sushi')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /clear all filters/i }))
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
    expect(screen.getByText('Beef Bourguignon')).toBeInTheDocument()
    expect(screen.getByText('Sushi')).toBeInTheDocument()
  })

  it('shows the max duration label as 4h in the slider', () => {
    renderPage()
    expect(screen.getAllByText('4h')[0]).toBeInTheDocument()
  })

  it('shows 0 as the min duration label in the slider', () => {
    renderPage()
    expect(screen.getAllByText('0')[0]).toBeInTheDocument()
  })
})
