import { NavLink } from 'react-router-dom'
import {
  FiHome,
  FiPackage,
  FiFolder,
  FiShoppingCart,
  FiUsers,
  FiTag,
  FiImage,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const menuItems = [
  { to: '/', icon: FiHome, label: 'Dashboard', end: true },
  { to: '/products', icon: FiPackage, label: 'Products' },
  { to: '/categories', icon: FiFolder, label: 'Categories' },
  { to: '/orders', icon: FiShoppingCart, label: 'Orders' },
  { to: '/users', icon: FiUsers, label: 'Users' },
  { to: '/coupons', icon: FiTag, label: 'Discount Codes' },
  { to: '/sliders', icon: FiImage, label: 'Sliders' },
  { to: '/settings', icon: FiSettings, label: 'Settings' },
]

const Sidebar = () => {
  const { logout } = useAuth()

  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <p className="text-gray-400 text-sm mt-1">Online Book Store</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
