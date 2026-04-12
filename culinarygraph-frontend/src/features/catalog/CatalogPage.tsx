import { Link } from 'react-router-dom'

export default function CatalogPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Catalog</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Browse techniques and ingredients from the culinary world.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/catalog/ingredients"
          className="border rounded-lg p-6 hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-400 transition-colors"
        >
          <h2 className="text-lg font-semibold mb-1">Ingredients</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Explore ingredients with seasonal info, substitutes, and provenance stories.
          </p>
        </Link>
        <Link
          to="/catalog/techniques"
          className="border rounded-lg p-6 hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-400 transition-colors"
        >
          <h2 className="text-lg font-semibold mb-1">Techniques</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Discover cooking techniques with step-by-step instructions.
          </p>
        </Link>
      </div>
    </div>
  )
}
