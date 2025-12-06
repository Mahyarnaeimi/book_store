import { useQuery } from '@tanstack/react-query'
import HeroSlider from '../../components/home/HeroSlider'
import CategoryGrid from '../../components/home/CategoryGrid'
import ProductSection from '../../components/home/ProductSection'
import { productService } from '../../services/product.service'

const Home = () => {
  const { data: featured, isLoading: loadingFeatured } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productService.getFeaturedProducts(8),
    select: (res) => res.data,
  })

  const { data: bestsellers, isLoading: loadingBestsellers } = useQuery({
    queryKey: ['products', 'bestsellers'],
    queryFn: () => productService.getBestsellers(8),
    select: (res) => res.data,
  })

  const { data: newArrivals, isLoading: loadingNew } = useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: () => productService.getNewArrivals(8),
    select: (res) => res.data,
  })

  return (
    <div>
      {/* Hero Slider */}
      <section className="mb-8">
        <HeroSlider />
      </section>

      {/* Features */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl">
          <span className="text-2xl">Fast</span>
          <div>
            <p className="font-medium text-sm">Fast Shipping</p>
            <p className="text-xs text-gray-500">Worldwide delivery</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl">
          <span className="text-2xl">Secure</span>
          <div>
            <p className="font-medium text-sm">Secure Payment</p>
            <p className="text-xs text-gray-500">Safe checkout</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl">
          <span className="text-2xl">Return</span>
          <div>
            <p className="font-medium text-sm">Easy Returns</p>
            <p className="text-xs text-gray-500">7-day policy</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl">
          <span className="text-2xl">Help</span>
          <div>
            <p className="font-medium text-sm">24/7 Support</p>
            <p className="text-xs text-gray-500">Always available</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <CategoryGrid />

      {/* Featured Products */}
      <ProductSection
        title="Featured Books"
        products={featured}
        isLoading={loadingFeatured}
        link="/products?featured=true"
      />

      {/* Banner */}
      <section className="my-10 bg-gradient-to-l from-primary-600 to-primary-800 rounded-xl p-8 text-white">
        <div className="max-w-2xl">
          <h3 className="text-2xl font-bold mb-2">Special Discount on Psychology Books</h3>
          <p className="mb-4 text-white/90">Up to 30% off on the best psychology and self-help books</p>
          <a href="/products?category=2" className="btn bg-white text-primary-700 hover:bg-gray-100">
            View Deals
          </a>
        </div>
      </section>

      {/* Bestsellers */}
      <ProductSection
        title="Bestsellers"
        products={bestsellers}
        isLoading={loadingBestsellers}
        link="/products?bestseller=true"
      />

      {/* New Arrivals */}
      <ProductSection
        title="New Arrivals"
        products={newArrivals}
        isLoading={loadingNew}
        link="/products?sort=newest"
      />
    </div>
  )
}

export default Home
