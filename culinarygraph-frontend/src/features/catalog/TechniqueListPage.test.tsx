import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useQuery } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import TechniqueListPage from './TechniqueListPage'

vi.mock('@tanstack/react-query', () => ({ useQuery: vi.fn() }))
vi.mock('../../auth/AuthProvider', () => ({ useAuth: () => ({ isAuthenticated: false }) }))
vi.mock('../../shared/components/EntityCardImage', () => ({
  default: () => <div data-testid="card-img" />,
}))

const mockTechniques = [
  { id: '1', name: 'Blanching', difficulty: 'EASY', country: 'France', region: 'Normandy' },
  { id: '2', name: 'Braising', difficulty: 'MEDIUM', country: 'France', region: 'Burgundy' },
  { id: '3', name: 'Tempering', difficulty: 'HARD', country: 'Japan', region: 'Tokyo' },
]

const renderPage = () =>
  render(<MemoryRouter><TechniqueListPage /></MemoryRouter>)

describe('TechniqueListPage', () => {
  beforeEach(() => {
    vi.mocked(useQuery).mockReturnValue({ data: mockTechniques, isLoading: false, error: null } as any)
  })

  it('renders all techniques when no filter is applied', () => {
    renderPage()
    expect(screen.getByText('Blanching')).toBeInTheDocument()
    expect(screen.getByText('Braising')).toBeInTheDocument()
    expect(screen.getByText('Tempering')).toBeInTheDocument()
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
    expect(screen.getByText('Tempering')).toBeInTheDocument()
    expect(screen.queryByText('Blanching')).not.toBeInTheDocument()
    expect(screen.queryByText('Braising')).not.toBeInTheDocument()
  })

  it('filters by country after clicking Apply Filters', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('checkbox', { name: /japan/i }))
    await userEvent.click(screen.getByRole('button', { name: /apply filters/i }))
    expect(screen.getByText('Tempering')).toBeInTheDocument()
    expect(screen.queryByText('Blanching')).not.toBeInTheDocument()
  })

  it('filters by region text after clicking Apply Filters', async () => {
    renderPage()
    await userEvent.type(screen.getByPlaceholderText(/aegean/i), 'Tokyo')
    await userEvent.click(screen.getByRole('button', { name: /apply filters/i }))
    expect(screen.getByText('Tempering')).toBeInTheDocument()
    expect(screen.queryByText('Blanching')).not.toBeInTheDocument()
    expect(screen.queryByText('Braising')).not.toBeInTheDocument()
  })

  it('clears filters and shows all techniques', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('checkbox', { name: /hard/i }))
    await userEvent.click(screen.getByRole('button', { name: /apply filters/i }))
    expect(screen.queryByText('Blanching')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /clear all filters/i }))
    expect(screen.getByText('Blanching')).toBeInTheDocument()
    expect(screen.getByText('Braising')).toBeInTheDocument()
    expect(screen.getByText('Tempering')).toBeInTheDocument()
  })

  it('filters by multiple difficulties at once', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('checkbox', { name: /easy/i }))
    await userEvent.click(screen.getByRole('checkbox', { name: /hard/i }))
    await userEvent.click(screen.getByRole('button', { name: /apply filters/i }))
    expect(screen.getByText('Blanching')).toBeInTheDocument()
    expect(screen.getByText('Tempering')).toBeInTheDocument()
    expect(screen.queryByText('Braising')).not.toBeInTheDocument()
  })
})
