import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { FiFilter, FiX } from 'react-icons/fi'
import ProductGrid from '../../components/product/ProductGrid'
import { productService } from '../../services/product.service'

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'bestseller', label: 'Bestsellers' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
]

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const params = {
    page: searchParams.get('page') || 1,
    limit: 12,
    sort: searchParams.get('sort') || 'newest',
    category: searchParams.get('category') || undefined,
    min_price: searchParams.get('min_price') || undefined,
    max_price: searchParams.get('max_price') || undefined,
    in_stock: searchParams.get('in_stock') === 'true' || undefined,
    featured: searchParams.get('featured') === 'true' || undefined,
    bestseller: searchParams.get('bestseller') === 'true' || undefined,
  }

  const { data, isLoading } = useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
    select: (res) => res.data,
  })

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    if (key !== 'page') newParams.delete('page')
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  const hasFilters = searchParams.toString().length > 0

  return (
    <div className="flex gap-6">
      {/* Sidebar Filters - Desktop */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-xl p-4 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Filters</h3>
            {hasFilters && (
              <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600">
                Clear
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-medium mb-3">Category</h4>
            <div className="space-y-2">
              {[
                { id: '1', name: 'Literature' },
                { id: '2', name: 'Psychology' },
                { id: '3', name: 'History' },
                { id: '4', name: 'Science' },
                { id: '5', name: 'Children' },
              ].map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={params.category === cat.id}
                    onChange={() => updateParam('category', params.category === cat.id ? '' : cat.id)}
                    className="text-primary-600"
                  />
                  <span className="text-sm">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="font-medium mb-3">Price Range</h4>
            <div className="space-y-2">
              <input
                type="number"
                placeholder="Min ($)"
                value={params.min_price || ''}
                onChange={(e) => updateParam('min_price', e.target.value)}
                className="input text-sm"
              />
              <input
                type="number"
                placeholder="Max ($)"
                value={params.max_price || ''}
                onChange={(e) => updateParam('max_price', e.target.value)}
                className="input text-sm"
              />
            </div>
          </div>

          {/* In Stock */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={params.in_stock || false}
                onChange={(e) => updateParam('in_stock', e.target.checked ? 'true' : '')}
                className="text-primary-600 rounded"
              />
              <span className="text-sm">In Stock Only</span>
            </label>
          </div>

          {/* Special */}
          <div>
            <h4 className="font-medium mb-3">Special</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={params.featured || false}
                  onChange={(e) => updateParam('featured', e.target.checked ? 'true' : '')}
                  className="text-primary-600 rounded"
                />
                <span className="text-sm">Featured Books</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={params.bestseller || false}
                  onChange={(e) => updateParam('bestseller', e.target.checked ? 'true' : '')}
                  className="text-primary-600 rounded"
                />
                <span className="text-sm">Bestsellers</span>
              </label>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden btn btn-secondary"
            >
              <FiFilter />
              Filters
            </button>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {data?.pagination?.totalItems || 0} books
            </p>
          </div>

          <select
            value={params.sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="input w-auto"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <ProductGrid products={data?.products} isLoading={isLoading} />

        {/* Pagination */}
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: data.pagination.totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => updateParam('page', String(i + 1))}
                className={`w-10 h-10 rounded-lg ${
                  data.pagination.page === i + 1
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
          <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <FiX size={24} />
              </button>
            </div>
            {/* Same filters as sidebar */}
            <div className="space-y-6">
              {/* Copy filter content here */}
              <button onClick={() => { clearFilters(); setShowFilters(false) }} className="btn btn-secondary w-full">
                Clear Filters
              </button>
              <button onClick={() => setShowFilters(false)} className="btn btn-primary w-full">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products
