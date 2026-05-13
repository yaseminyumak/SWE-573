import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'
import { useState } from 'react'
import type { ReactNode } from 'react'

function NavLink({ to, children }: { to: string; children: ReactNode }) {
  const { pathname } = useLocation()
  const active = to === '/' ? pathname === '/' : pathname.startsWith(to)
  return (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        active ? 'text-[#d67ec9]' : 'text-gray-300 hover:text-[#d67ec9]'
      }`}
    >
      {children}
    </Link>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  const { isAuthenticated, login, logout } = useAuth()
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#ede8ee] text-gray-900">
      <header className="bg-[#171433] sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-6">
          <Link to="/" className="font-bold text-white text-lg whitespace-nowrap tracking-tight">
            CulinaryGraph
          </Link>
          <form onSubmit={handleSearch} className="flex-1 max-w-xs">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-1.5 rounded text-sm bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-[#d67ec9] focus:bg-white/15 transition-colors"
            />
          </form>
          <nav className="flex items-center gap-5 ml-auto">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/catalog/techniques">Techniques</NavLink>
            <NavLink to="/catalog/ingredients">Ingredients</NavLink>
            <NavLink to="/recipes">Recipes</NavLink>
            <NavLink to="/heritage">Heritage</NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/profile">Profile</NavLink>
                <button
                  onClick={() => logout()}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => login()}
                className="text-sm px-4 py-1.5 rounded bg-[#8c2d9c] text-white hover:bg-[#7a2589] transition-colors font-medium"
              >
                Login / Register
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
