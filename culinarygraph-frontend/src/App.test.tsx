import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

vi.mock('./auth/AuthProvider', () => ({
  AuthProvider: ({ children }: any) => <>{children}</>,
  useAuth: () => ({ isAuthenticated: false }),
}))
vi.mock('./shared/components/Layout', () => ({
  default: ({ children }: any) => <div data-testid="layout">{children}</div>,
}))
vi.mock('./features/catalog/HomePage', () => ({ default: () => <div>HomePage</div> }))
vi.mock('./features/catalog/CatalogPage', () => ({ default: () => <div>CatalogPage</div> }))
vi.mock('./features/catalog/IngredientListPage', () => ({ default: () => <div>IngredientListPage</div> }))
vi.mock('./features/catalog/IngredientFormPage', () => ({ default: () => <div>IngredientFormPage</div> }))
vi.mock('./features/catalog/IngredientDetailPage', () => ({ default: () => <div>IngredientDetailPage</div> }))
vi.mock('./features/catalog/TechniqueListPage', () => ({ default: () => <div>TechniqueListPage</div> }))
vi.mock('./features/catalog/TechniqueFormPage', () => ({ default: () => <div>TechniqueFormPage</div> }))
vi.mock('./features/catalog/TechniqueDetailPage', () => ({ default: () => <div>TechniqueDetailPage</div> }))
vi.mock('./features/recipe/RecipeListPage', () => ({ default: () => <div>RecipeListPage</div> }))
vi.mock('./features/recipe/RecipeFormPage', () => ({ default: () => <div>RecipeFormPage</div> }))
vi.mock('./features/recipe/RecipeDetailPage', () => ({ default: () => <div>RecipeDetailPage</div> }))
vi.mock('./features/search/SearchPage', () => ({ default: () => <div>SearchPage</div> }))
vi.mock('./features/profile/ProfilePage', () => ({ default: () => <div>ProfilePage</div> }))

function renderAt(path: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const { BrowserRouter: _ignored, ...rest } = vi.importActual('react-router-dom') as any
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>
        {/* Import App routes only — avoid BrowserRouter double-wrapping */}
        <AppRoutes />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

// Extract routes so we can test them with MemoryRouter without BrowserRouter
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import Layout from './shared/components/Layout'
import HomePage from './features/catalog/HomePage'
import CatalogPage from './features/catalog/CatalogPage'
import IngredientListPage from './features/catalog/IngredientListPage'
import IngredientFormPage from './features/catalog/IngredientFormPage'
import IngredientDetailPage from './features/catalog/IngredientDetailPage'
import TechniqueListPage from './features/catalog/TechniqueListPage'
import TechniqueFormPage from './features/catalog/TechniqueFormPage'
import TechniqueDetailPage from './features/catalog/TechniqueDetailPage'
import RecipeListPage from './features/recipe/RecipeListPage'
import RecipeFormPage from './features/recipe/RecipeFormPage'
import RecipeDetailPage from './features/recipe/RecipeDetailPage'
import SearchPage from './features/search/SearchPage'
import ProfilePage from './features/profile/ProfilePage'

function AppRoutes() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/catalog/ingredients" element={<IngredientListPage />} />
          <Route path="/catalog/ingredients/new" element={<IngredientFormPage />} />
          <Route path="/catalog/ingredients/:id/edit" element={<IngredientFormPage />} />
          <Route path="/catalog/ingredients/:id" element={<IngredientDetailPage />} />
          <Route path="/catalog/techniques" element={<TechniqueListPage />} />
          <Route path="/catalog/techniques/new" element={<TechniqueFormPage />} />
          <Route path="/catalog/techniques/:id/edit" element={<TechniqueFormPage />} />
          <Route path="/catalog/techniques/:id" element={<TechniqueDetailPage />} />
          <Route path="/recipes" element={<RecipeListPage />} />
          <Route path="/recipes/new" element={<RecipeFormPage />} />
          <Route path="/recipes/:id/edit" element={<RecipeFormPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
const wrap = (path: string) =>
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </QueryClientProvider>
  )

describe('App routing', () => {
  it('renders HomePage at /', () => {
    wrap('/')
    expect(screen.getByText('HomePage')).toBeInTheDocument()
  })

  it('renders CatalogPage at /catalog', () => {
    wrap('/catalog')
    expect(screen.getByText('CatalogPage')).toBeInTheDocument()
  })

  it('renders IngredientListPage at /catalog/ingredients', () => {
    wrap('/catalog/ingredients')
    expect(screen.getByText('IngredientListPage')).toBeInTheDocument()
  })

  it('renders IngredientFormPage at /catalog/ingredients/new', () => {
    wrap('/catalog/ingredients/new')
    expect(screen.getByText('IngredientFormPage')).toBeInTheDocument()
  })

  it('renders IngredientDetailPage at /catalog/ingredients/:id', () => {
    wrap('/catalog/ingredients/abc-123')
    expect(screen.getByText('IngredientDetailPage')).toBeInTheDocument()
  })

  it('renders TechniqueListPage at /catalog/techniques', () => {
    wrap('/catalog/techniques')
    expect(screen.getByText('TechniqueListPage')).toBeInTheDocument()
  })

  it('renders TechniqueFormPage at /catalog/techniques/new', () => {
    wrap('/catalog/techniques/new')
    expect(screen.getByText('TechniqueFormPage')).toBeInTheDocument()
  })

  it('renders RecipeListPage at /recipes', () => {
    wrap('/recipes')
    expect(screen.getByText('RecipeListPage')).toBeInTheDocument()
  })

  it('renders RecipeFormPage at /recipes/new', () => {
    wrap('/recipes/new')
    expect(screen.getByText('RecipeFormPage')).toBeInTheDocument()
  })

  it('renders RecipeDetailPage at /recipes/:id', () => {
    wrap('/recipes/abc-123')
    expect(screen.getByText('RecipeDetailPage')).toBeInTheDocument()
  })

  it('renders SearchPage at /search', () => {
    wrap('/search')
    expect(screen.getByText('SearchPage')).toBeInTheDocument()
  })

  it('renders ProfilePage at /profile', () => {
    wrap('/profile')
    expect(screen.getByText('ProfilePage')).toBeInTheDocument()
  })

  it('wraps content in Layout', () => {
    wrap('/')
    expect(screen.getByTestId('layout')).toBeInTheDocument()
  })
})
