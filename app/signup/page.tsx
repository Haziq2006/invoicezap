'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, Eye, EyeOff, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { initializeFreshDashboard } from '@/lib/dataService'

export default function SignupPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    plan: 'free'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await signUp(formData.email, formData.password, formData.firstName, formData.lastName, formData.plan)
      
      if (error) {
        toast.error(error.message || 'Failed to create account. Please try again.')
        return
      }
      
      // Initialize fresh dashboard for new users
      if (typeof window !== 'undefined') {
        initializeFreshDashboard()
      }
      
      toast.success('Account created successfully! Let\'s set up your workspace.')
      router.push('/onboarding')
    } catch (error) {
      toast.error('Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '£0',
      description: 'Perfect for getting started',
      features: ['Unlimited invoices', 'Basic templates', 'PDF export', 'Email delivery']
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '£12',
      description: 'For growing freelancers',
      features: ['Everything in Free', 'Custom branding', 'Payment links', 'Priority support'],
      popular: true
    },
    {
      id: 'business',
      name: 'Business',
      price: '£35',
      description: 'For established businesses',
      features: ['Everything in Pro', 'Premium templates', 'Team collaboration', 'Advanced analytics']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <Zap className="h-10 w-10 text-primary-600" />
            <span className="text-3xl font-bold text-gray-900">InvoiceZap</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Choose your plan</h3>
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`card cursor-pointer transition-all duration-200 ${
                  formData.plan === plan.id
                    ? 'ring-2 ring-primary-500 border-primary-500'
                    : 'hover:border-gray-300'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, plan: plan.id }))}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
                      {plan.popular && (
                        <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                          Most Popular
                        </span>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{plan.price}</div>
                    <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
                    <ul className="mt-3 space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-success-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="ml-4">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.plan === plan.id
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.plan === plan.id && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Signup Form */}
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="input-field pr-10"
                    placeholder="••••••••"
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Must be at least 8 characters long
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-primary-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-600 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
