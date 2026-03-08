import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'

export default function HomePage() {
  const { login, register, logout, isAuthenticated } = useAuth()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold">CulinaryGraph</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Documenting regional cooking techniques and ingredients
      </p>
      <div className="flex gap-4 items-center">
        {isAuthenticated ? (
          <button
            type="button"
            onClick={() => logout()}
            className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => login()}
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => register()}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Kayıt ol
            </button>
          </>
        )}
      </div>
      <nav className="flex gap-4">
        <Link
          to="/catalog"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Catalog
        </Link>
        <Link
          to="/recipes"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Recipes
        </Link>
        <Link
          to="/search"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Search
        </Link>
      </nav>
    </div>
  )
}
