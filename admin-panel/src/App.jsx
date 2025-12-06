import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Users from './pages/Users'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<div className="card p-6"><h1 className="text-xl font-bold">Categories</h1><p className="text-gray-500 mt-4">Under development...</p></div>} />
        <Route path="orders" element={<Orders />} />
        <Route path="users" element={<Users />} />
        <Route path="coupons" element={<div className="card p-6"><h1 className="text-xl font-bold">Discount Codes</h1><p className="text-gray-500 mt-4">Under development...</p></div>} />
        <Route path="sliders" element={<div className="card p-6"><h1 className="text-xl font-bold">Sliders</h1><p className="text-gray-500 mt-4">Under development...</p></div>} />
        <Route path="settings" element={<div className="card p-6"><h1 className="text-xl font-bold">Settings</h1><p className="text-gray-500 mt-4">Under development...</p></div>} />
      </Route>
    </Routes>
  )
}

export default App
