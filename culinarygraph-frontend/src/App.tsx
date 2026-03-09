import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './auth/AuthProvider'
import HomePage from './features/catalog/HomePage'
import CatalogPage from './features/catalog/CatalogPage'
import RecipeListPage from './features/recipe/RecipeListPage'
import RecipeFormPage from './features/recipe/RecipeFormPage'
import RecipeDetailPage from './features/recipe/RecipeDetailPage'
import SearchPage from './features/search/SearchPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/recipes" element={<RecipeListPage />} />
            <Route path="/recipes/new" element={<RecipeFormPage />} />
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
