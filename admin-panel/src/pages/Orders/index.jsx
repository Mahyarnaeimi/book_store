import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FiEye, FiTruck } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { adminService } from '../../services/admin.service'

const formatPrice = (price) => new Intl.NumberFormat('en-US').format(price)

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

const statusLabels = {
  pending: { label: 'Pending', class: 'badge-warning' },
  paid: { label: 'Paid', class: 'badge-info' },
  processing: { label: 'Processing', class: 'badge-info' },
  shipped: { label: 'Shipped', class: 'badge-info' },
  delivered: { label: 'Delivered', class: 'badge-success' },
  cancelled: { label: 'Cancelled', class: 'badge-danger' },
  refunded: { label: 'Refunded', class: 'badge-danger' },
}

const Orders = () => {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', { page, status }],
    queryFn: () => adminService.getOrders({ page, limit: 20, status: status || undefined }),
    select: (res) => res.data,
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => adminService.updateOrderStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-orders'])
      toast.success('Status updated')
    },
    onError: (error) => toast.error(error.message || 'Error'),
  })

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Order Management</h1>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input w-auto"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : data?.orders?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                data?.orders?.map((order) => (
                  <tr key={order.id}>
                    <td className="font-medium">{order.order_number}</td>
                    <td>
                      <p>{order.first_name} {order.last_name}</p>
                      <p className="text-xs text-gray-500">{order.email}</p>
                    </td>
                    <td>{formatPrice(order.total_amount)} USD</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-sm border rounded px-2 py-1 bg-transparent"
                      >
                        {statusOptions.slice(1).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span className={`badge ${order.payment_status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                        {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="text-gray-500 text-sm">
                      {new Date(order.created_at).toLocaleDateString('en-US')}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          title="View"
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          title="Add tracking code"
                        >
                          <FiTruck size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto m-4">
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-bold">Order Details {selectedOrder.order_number}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">
                X
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Customer:</p>
                  <p>{selectedOrder.first_name} {selectedOrder.last_name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone:</p>
                  <p>{selectedOrder.shipping_phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Address:</p>
                  <p>{selectedOrder.shipping_province} - {selectedOrder.shipping_city} - {selectedOrder.shipping_address}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Amount:</p>
                  <p className="font-bold text-primary-600">{formatPrice(selectedOrder.total_amount)} USD</p>
                </div>
                <div>
                  <p className="text-gray-500">Tracking Code:</p>
                  <p>{selectedOrder.tracking_code || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
