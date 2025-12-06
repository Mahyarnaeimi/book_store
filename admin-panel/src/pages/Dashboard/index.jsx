import { useQuery } from '@tanstack/react-query'
import { FiDollarSign, FiShoppingCart, FiUsers, FiPackage, FiAlertCircle } from 'react-icons/fi'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { adminService } from '../../services/admin.service'

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('en-US').format(price)
}

const StatCard = ({ icon: Icon, label, value, color, suffix }) => (
  <div className="stat-card">
    <div className="flex items-center justify-between">
      <div>
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-value">{value}{suffix}</p>
      </div>
      <div className={`stat-card-icon ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
)

const Dashboard = () => {
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: adminService.getDashboardStats,
    select: (res) => res.data,
  })

  const { data: salesData } = useQuery({
    queryKey: ['sales-report'],
    queryFn: () => adminService.getSalesReport('7days'),
    select: (res) => res.data,
  })

  const { data: recentOrders } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: adminService.getRecentOrders,
    select: (res) => res.data,
  })

  const statusLabels = {
    pending: { label: 'Pending', class: 'badge-warning' },
    paid: { label: 'Paid', class: 'badge-info' },
    processing: { label: 'Processing', class: 'badge-info' },
    shipped: { label: 'Shipped', class: 'badge-info' },
    delivered: { label: 'Delivered', class: 'badge-success' },
    cancelled: { label: 'Cancelled', class: 'badge-danger' },
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FiDollarSign}
          label="Today's Sales"
          value={formatPrice(stats?.todaySales)}
          suffix=" USD"
          color="bg-green-500"
        />
        <StatCard
          icon={FiShoppingCart}
          label="Total Orders"
          value={stats?.totalOrders || 0}
          color="bg-blue-500"
        />
        <StatCard
          icon={FiUsers}
          label="Users"
          value={stats?.totalUsers || 0}
          color="bg-purple-500"
        />
        <StatCard
          icon={FiPackage}
          label="Products"
          value={stats?.totalProducts || 0}
          color="bg-orange-500"
        />
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-3 text-orange-600 mb-4">
            <FiAlertCircle size={20} />
            <h3 className="font-medium">Pending Orders</h3>
          </div>
          <p className="text-3xl font-bold">{stats?.pendingOrders || 0}</p>
          <p className="text-gray-500 text-sm mt-1">Orders need review</p>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <FiAlertCircle size={20} />
            <h3 className="font-medium">Low Stock</h3>
          </div>
          <p className="text-3xl font-bold">{stats?.lowStockProducts || 0}</p>
          <p className="text-gray-500 text-sm mt-1">Products with less than 10 items</p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="card p-6">
        <h3 className="font-bold mb-6">Weekly Sales Chart</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value) => [formatPrice(value) + ' USD', 'Sales']}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ fill: '#2563eb' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="p-6 border-b dark:border-gray-700">
          <h3 className="font-bold">Recent Orders</h3>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders?.map((order) => (
                <tr key={order.id}>
                  <td className="font-medium">{order.order_number}</td>
                  <td>{order.first_name} {order.last_name}</td>
                  <td>{formatPrice(order.total_amount)} USD</td>
                  <td>
                    <span className={`badge ${statusLabels[order.status]?.class}`}>
                      {statusLabels[order.status]?.label}
                    </span>
                  </td>
                  <td className="text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-US')}
                  </td>
                </tr>
              ))}
              {(!recentOrders || recentOrders.length === 0) && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
