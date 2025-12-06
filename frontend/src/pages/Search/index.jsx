import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import ProductGrid from '../../components/product/ProductGrid'
import { productService } from '../../services/product.service'

const Search = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => productService.searchProducts(query),
    select: (res) => res.data,
    enabled: query.length >= 2,
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Search Results</h1>
      <p className="text-gray-500 mb-6">
        {query && `Search for "${query}"`}
        {data?.pagination && ` - ${data.pagination.totalItems} results`}
      </p>

      {query.length < 2 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Please enter at least 2 characters</p>
        </div>
      ) : (
        <ProductGrid products={data?.products} isLoading={isLoading} />
      )}
    </div>
  )
}

export default Search
