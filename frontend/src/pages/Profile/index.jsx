import { Outlet, NavLink, Navigate } from 'react-router-dom'
import { FiUser, FiShoppingBag, FiHeart, FiMapPin, FiSettings, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const menuItems = [
    { to: '/profile', icon: FiUser, label: 'Dashboard', end: true },
    { to: '/profile/orders', icon: FiShoppingBag, label: 'Orders' },
    { to: '/profile/wishlist', icon: FiHeart, label: 'Wishlist' },
    { to: '/profile/addresses', icon: FiMapPin, label: 'Addresses' },
    { to: '/profile/settings', icon: FiSettings, label: 'Settings' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar */}
      <aside className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          {/* User info */}
          <div className="text-center pb-6 border-b dark:border-gray-700">
            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-primary-600">
                {user?.first_name?.charAt(0)}
              </span>
            </div>
            <h3 className="font-bold">{user?.first_name} {user?.last_name}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          {/* Menu */}
          <nav className="mt-6 space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`
                }
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:col-span-3">
        <Outlet />
      </main>
    </div>
  )
}

// Dashboard component
export const ProfileDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Hello {user?.first_name}! Welcome to your account panel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-primary-600">5</div>
          <div className="text-gray-500 mt-1">Orders</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-primary-600">12</div>
          <div className="text-gray-500 mt-1">Wishlist</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-primary-600">2</div>
          <div className="text-gray-500 mt-1">Addresses</div>
        </div>
      </div>
    </div>
  )
}

export default Profile
