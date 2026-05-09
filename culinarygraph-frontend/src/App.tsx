import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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
import PublicProfilePage from './features/profile/PublicProfilePage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
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
              <Route path="/profile/:username" element={<PublicProfilePage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
