import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiShoppingCart, FiUser, FiHeart, FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useTheme } from '../../context/ThemeContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const { summary, openCart } = useCart()
  const { theme, toggleTheme } = useTheme()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="hidden md:flex items-center justify-between py-2 text-sm border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-400">Contact: +1-234-567-8900</span>
            <span className="text-gray-600 dark:text-gray-400">Free shipping on orders over $50</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-1 hover:text-primary-600">
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="hover:text-primary-600">My Account</Link>
                <button onClick={logout} className="hover:text-primary-600">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary-600">Login</Link>
                <Link to="/register" className="hover:text-primary-600">Register</Link>
              </>
            )}
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-primary-600">
            Book Store
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, authors..."
                className="input pl-10"
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600">
                <FiSearch size={20} />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="md:hidden p-2 hover:text-primary-600">
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {isAuthenticated && (
              <Link to="/profile/wishlist" className="hidden md:block p-2 hover:text-primary-600">
                <FiHeart size={22} />
              </Link>
            )}

            <button onClick={openCart} className="p-2 hover:text-primary-600 relative">
              <FiShoppingCart size={22} />
              {summary.item_count > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {summary.item_count}
                </span>
              )}
            </button>

            <Link to={isAuthenticated ? '/profile' : '/login'} className="hidden md:block p-2 hover:text-primary-600">
              <FiUser size={22} />
            </Link>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Categories nav */}
        <nav className="hidden md:block border-t border-gray-100 dark:border-gray-700">
          <ul className="flex items-center gap-6 py-3">
            <li><Link to="/products" className="hover:text-primary-600 font-medium">All Books</Link></li>
            <li><Link to="/products?category=1" className="hover:text-primary-600">Literature</Link></li>
            <li><Link to="/products?category=2" className="hover:text-primary-600">Psychology</Link></li>
            <li><Link to="/products?category=3" className="hover:text-primary-600">History</Link></li>
            <li><Link to="/products?category=4" className="hover:text-primary-600">Science</Link></li>
            <li><Link to="/products?category=5" className="hover:text-primary-600">Children</Link></li>
            <li><Link to="/products?bestseller=true" className="text-red-500 hover:text-red-600">Bestsellers</Link></li>
          </ul>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSearch} className="p-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="input pl-10"
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
                <FiSearch />
              </button>
            </div>
          </form>
          <ul className="px-4 pb-4 space-y-2">
            <li><Link to="/products" className="block py-2 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>All Books</Link></li>
            <li><Link to="/products?category=1" className="block py-2 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>Literature</Link></li>
            <li><Link to="/products?category=2" className="block py-2 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>Psychology</Link></li>
            <li><Link to="/products?category=3" className="block py-2 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>History</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link to="/profile" className="block py-2 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>My Account</Link></li>
                <li><Link to="/profile/wishlist" className="block py-2 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>Wishlist</Link></li>
                <li><button onClick={() => { logout(); setIsMenuOpen(false) }} className="block py-2 text-red-500">Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="block py-2 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>Login</Link></li>
                <li><Link to="/register" className="block py-2 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>Register</Link></li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  )
}

export default Header
