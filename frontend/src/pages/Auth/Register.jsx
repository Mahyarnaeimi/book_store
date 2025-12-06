import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await registerUser(data)
      if (response.success) {
        toast.success('Registration successful')
        navigate('/')
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Create Account</h1>
            <p className="text-gray-500">Join our book lovers community</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <div className="relative">
                  <FiUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    {...register('first_name', {
                      required: 'First name is required',
                      minLength: { value: 2, message: 'Min 2 characters' },
                    })}
                    className="input pr-10"
                    placeholder="First name"
                  />
                </div>
                {errors.first_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  {...register('last_name', {
                    required: 'Last name is required',
                    minLength: { value: 2, message: 'Min 2 characters' },
                  })}
                  className="input"
                  placeholder="Last name"
                />
                {errors.last_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="input pr-10"
                  placeholder="email@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone (optional)</label>
              <div className="relative">
                <FiPhone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  {...register('phone', {
                    pattern: {
                      value: /^\+?[\d\s-]{10,}$/,
                      message: 'Invalid phone number',
                    },
                  })}
                  className="input pr-10"
                  placeholder="+1234567890"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Min 6 characters' },
                  })}
                  className="input pr-10 pl-10"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <label className="flex items-start gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                {...register('terms', { required: 'You must accept the terms' })}
                className="rounded text-primary-600 mt-1"
              />
              <span>
                I agree to the <Link to="/terms" className="text-primary-600 hover:underline">Terms and Conditions</Link>
              </span>
            </label>
            {errors.terms && (
              <p className="text-red-500 text-sm">{errors.terms.message}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full py-3 disabled:opacity-50"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
