import { FiBell, FiUser, FiSun, FiMoon } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const Header = ({ theme, toggleTheme }) => {
  const { user } = useAuth()

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-medium">Welcome, {user?.first_name}</h2>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>

        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
          <FiBell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3 pr-4 border-r dark:border-gray-700">
          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <FiUser className="text-primary-600" size={16} />
          </div>
          <div className="text-sm">
            <p className="font-medium">{user?.first_name} {user?.last_name}</p>
            <p className="text-gray-500 text-xs">{user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
