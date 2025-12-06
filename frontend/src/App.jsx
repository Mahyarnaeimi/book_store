import { Routes, Route } from 'react-router-dom'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import MiniCart from './components/common/MiniCart'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Profile, { ProfileDashboard } from './pages/Profile'
import Search from './pages/Search'

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />}>
            <Route index element={<ProfileDashboard />} />
            <Route path="orders" element={<div className="bg-white dark:bg-gray-800 rounded-xl p-6"><h2 className="text-xl font-bold">My Orders</h2><p className="text-gray-500 mt-4">No orders found</p></div>} />
            <Route path="wishlist" element={<div className="bg-white dark:bg-gray-800 rounded-xl p-6"><h2 className="text-xl font-bold">Wishlist</h2><p className="text-gray-500 mt-4">List is empty</p></div>} />
            <Route path="addresses" element={<div className="bg-white dark:bg-gray-800 rounded-xl p-6"><h2 className="text-xl font-bold">Addresses</h2><p className="text-gray-500 mt-4">No addresses saved</p></div>} />
            <Route path="settings" element={<div className="bg-white dark:bg-gray-800 rounded-xl p-6"><h2 className="text-xl font-bold">Settings</h2><p className="text-gray-500 mt-4">Account settings</p></div>} />
          </Route>
          <Route path="*" element={
            <div className="text-center py-16">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-gray-500">Page not found</p>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
      <MiniCart />
    </div>
  )
}

export default App
