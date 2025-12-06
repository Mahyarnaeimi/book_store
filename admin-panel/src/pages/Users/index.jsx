import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FiSearch, FiUser, FiLock, FiUnlock } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { adminService } from '../../services/admin.service'

const Users = () => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', { page, search }],
    queryFn: () => adminService.getUsers({ page, limit: 20, search }),
    select: (res) => res.data,
  })

  const blockMutation = useMutation({
    mutationFn: adminService.blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users'])
      toast.success('User status changed')
    },
    onError: (error) => toast.error(error.message || 'Error'),
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>

      {/* Filters */}
      <div className="card p-4">
        <div className="relative max-w-md">
          <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="input pr-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Join Date</th>
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
              ) : data?.users?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                data?.users?.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                          <FiUser className="text-primary-600" size={14} />
                        </div>
                        <span>{user.first_name} {user.last_name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone || '-'}</td>
                    <td>
                      <span className={`badge ${user.role === 'admin' || user.role === 'super_admin' ? 'badge-info' : 'badge-success'}`}>
                        {user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'Customer'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.is_active ? 'badge-success' : 'badge-danger'}`}>
                        {user.is_active ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="text-gray-500 text-sm">
                      {new Date(user.created_at).toLocaleDateString('en-US')}
                    </td>
                    <td>
                      <button
                        onClick={() => blockMutation.mutate(user.id)}
                        className={`p-2 rounded ${user.is_active ? 'hover:bg-red-50 text-red-500' : 'hover:bg-green-50 text-green-500'}`}
                        title={user.is_active ? 'Block' : 'Activate'}
                      >
                        {user.is_active ? <FiLock size={16} /> : <FiUnlock size={16} />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Users
