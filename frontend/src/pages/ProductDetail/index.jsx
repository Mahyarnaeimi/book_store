import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FiShoppingCart, FiHeart, FiShare2, FiMinus, FiPlus, FiCheck } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import { productService } from '../../services/product.service'
import { useCart } from '../../context/CartContext'
import { formatPrice, formatNumber } from '../../utils/formatPrice'
import { PageLoading } from '../../components/common/Loading'
import ProductGrid from '../../components/product/ProductGrid'

const ProductDetail = () => {
  const { slug } = useParams()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProductBySlug(slug),
    select: (res) => res.data,
  })

  const { data: relatedProducts } = useQuery({
    queryKey: ['products', 'related', product?.category_id],
    queryFn: () => productService.getProducts({ category: product.category_id, limit: 4 }),
    select: (res) => res.data?.products?.filter((p) => p.id !== product.id),
    enabled: !!product?.category_id,
  })

  if (isLoading) return <PageLoading />

  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link to="/products" className="text-primary-600 hover:underline">
          Back to products
        </Link>
      </div>
    )
  }

  const mainImage = product.images?.find((img) => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    '/images/placeholder-book.jpg'

  const handleAddToCart = () => {
    addToCart(product.id, quantity)
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-primary-600">Books</Link>
        {product.category_name && (
          <>
            <span className="mx-2">/</span>
            <Link to={`/products?category=${product.category_id}`} className="hover:text-primary-600">
              {product.category_name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-gray-100">{product.title}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
            <img
              src={mainImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className="w-20 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-primary-600"
                >
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          {product.title_en && (
            <p className="text-gray-500 dark:text-gray-400 mb-4">{product.title_en}</p>
          )}

          {/* Author */}
          {product.author_name && (
            <p className="mb-2">
              <span className="text-gray-500">Author:</span>{' '}
              <Link to={`/products?author=${product.author_id}`} className="text-primary-600 hover:underline">
                {product.author_name}
              </Link>
            </p>
          )}

          {/* Publisher */}
          {product.publisher_name && (
            <p className="mb-2">
              <span className="text-gray-500">Publisher:</span>{' '}
              <span>{product.publisher_name}</span>
            </p>
          )}

          {/* Rating */}
          {product.rating_avg > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={star <= product.rating_avg ? 'text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({formatNumber(product.rating_count)} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-4 my-6">
            {product.discount_percent > 0 && (
              <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                {product.discount_percent}% OFF
              </span>
            )}
            <span className="text-3xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-gray-400 text-lg line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="flex items-center gap-2 text-green-600">
                <FiCheck />
                In Stock ({formatNumber(product.stock)} available)
              </span>
            ) : (
              <span className="text-red-500">Out of Stock</span>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border dark:border-gray-700 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiMinus />
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiPlus />
                </button>
              </div>
              <button onClick={handleAddToCart} className="btn btn-primary flex-1 py-3">
                <FiShoppingCart />
                Add to Cart
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button className="btn btn-secondary flex-1">
              <FiHeart />
              Wishlist
            </button>
            <button className="btn btn-secondary flex-1">
              <FiShare2 />
              Share
            </button>
          </div>

          {/* Short description */}
          {product.short_description && (
            <p className="mt-6 text-gray-600 dark:text-gray-400">{product.short_description}</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl">
        <div className="border-b dark:border-gray-700">
          <nav className="flex gap-8 px-6">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specs', label: 'Specifications' },
              { id: 'reviews', label: 'Reviews' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'description' && (
            <div className="prose dark:prose-invert max-w-none">
              {product.description || 'No description available for this product.'}
            </div>
          )}

          {activeTab === 'specs' && (
            <table className="w-full max-w-2xl">
              <tbody className="divide-y dark:divide-gray-700">
                {product.isbn && (
                  <tr>
                    <td className="py-3 text-gray-500 w-40">ISBN</td>
                    <td className="py-3">{product.isbn}</td>
                  </tr>
                )}
                {product.pages && (
                  <tr>
                    <td className="py-3 text-gray-500">Pages</td>
                    <td className="py-3">{formatNumber(product.pages)}</td>
                  </tr>
                )}
                {product.publish_year && (
                  <tr>
                    <td className="py-3 text-gray-500">Publication Year</td>
                    <td className="py-3">{product.publish_year}</td>
                  </tr>
                )}
                {product.translator && (
                  <tr>
                    <td className="py-3 text-gray-500">Translator</td>
                    <td className="py-3">{product.translator}</td>
                  </tr>
                )}
                {product.language && (
                  <tr>
                    <td className="py-3 text-gray-500">Language</td>
                    <td className="py-3">{product.language}</td>
                  </tr>
                )}
                {product.format && (
                  <tr>
                    <td className="py-3 text-gray-500">Format</td>
                    <td className="py-3">
                      {product.format === 'hardcover' ? 'Hardcover' :
                       product.format === 'paperback' ? 'Paperback' : 'E-book'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'reviews' && (
            <div className="text-center py-8 text-gray-500">
              No reviews yet.
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-6">Related Books</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  )
}

export default ProductDetail
