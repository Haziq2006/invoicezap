'use client'

import { useState, useEffect } from 'react'
import { 
  User, 
  CreditCard, 
  Bell, 
  Shield, 
  Palette, 
  Download,
  Save,
  Camera,
  Edit,
  CheckCircle
} from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from '@/components/Navigation'
import toast from 'react-hot-toast'
import { loadStripe } from '@stripe/stripe-js'

interface Profile {
  firstName: string
  lastName: string
  email: string
  company: string
  phone: string
  address: string
  logo?: string
  plan: 'free' | 'pro' | 'business'
  currency: string
  timezone: string
  language: string
}

interface BillingInfo {
  cardLast4: string
  cardBrand: string
  nextBillingDate: string
  planName: string
  planPrice: string
  status: 'active' | 'cancelled' | 'past_due'
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<Profile>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    company: 'Freelance Designer',
    phone: '+44 20 1234 5678',
    address: '123 Business St, London, UK',
    plan: 'pro',
    currency: 'GBP',
    timezone: 'Europe/London',
    language: 'en'
  })

  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    cardLast4: '4242',
    cardBrand: 'Visa',
    nextBillingDate: '2024-02-15',
    planName: 'Pro',
    planPrice: '£12/month',
    status: 'active'
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    paymentReminders: true,
    overdueAlerts: true,
    weeklyReports: false,
    marketingEmails: false
  })

  const [appearance, setAppearance] = useState({
    theme: 'light',
    accentColor: 'blue',
    compactMode: false
  })

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Update profile using the API
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user_123', // TODO: Get from auth context
          ...profile
        })
      })
      
      if (response.ok) {
        toast.success('Profile updated successfully!')
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlanUpgrade = async (plan: 'pro' | 'business') => {
    try {
      // Create Stripe checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan, 
          userId: 'user_123' // TODO: Get from auth context
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }
      
      const { sessionId } = await response.json()
      
      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          throw error
        }
      } else {
        throw new Error('Stripe failed to load')
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      toast.error('Failed to upgrade plan. Please try again.')
    }
  }

  const handlePlanCancel = async () => {
    if (confirm('Are you sure you want to cancel your subscription? You\'ll lose access to premium features at the end of your billing period.')) {
      try {
        // Cancel subscription via API
        const response = await fetch('/api/stripe/cancel-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'user_123', // TODO: Get from auth context
            subscriptionId: 'sub_123' // TODO: Get from user profile
          })
        })
        
        if (response.ok) {
          toast.success('Subscription cancelled successfully')
          // Update local state
          setBillingInfo(prev => ({ ...prev, status: 'cancelled' }))
        } else {
          throw new Error('Failed to cancel subscription')
        }
      } catch (error) {
        toast.error('Failed to cancel subscription. Please try again.')
      }
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield }
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-64">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                    
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      {/* Profile Picture */}
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                          </div>
                          <button
                            type="button"
                            className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-blue-500 transition-colors"
                          >
                            <Camera className="h-3 w-3 text-gray-600" />
                          </button>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{profile.firstName} {profile.lastName}</h3>
                          <p className="text-gray-500">{profile.email}</p>
                          <p className="text-sm text-gray-400">Pro Plan • Member since 2023</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name *
                          </label>
                          <input
                            type="text"
                            value={profile.firstName}
                            onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                            className="input-field"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={profile.lastName}
                            onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                            className="input-field"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                            className="input-field"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                            className="input-field"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company
                          </label>
                          <input
                            type="text"
                            value={profile.company}
                            onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                            className="input-field"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                          </label>
                          <textarea
                            value={profile.address}
                            onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                            className="input-field"
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Currency
                          </label>
                          <select
                            value={profile.currency}
                            onChange={(e) => setProfile(prev => ({ ...prev, currency: e.target.value }))}
                            className="input-field"
                          >
                            <option value="GBP">GBP (£)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Timezone
                          </label>
                          <select
                            value={profile.timezone}
                            onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
                            className="input-field"
                          >
                            <option value="Europe/London">Europe/London</option>
                            <option value="America/New_York">America/New_York</option>
                            <option value="Asia/Tokyo">Asia/Tokyo</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Language
                          </label>
                          <select
                            value={profile.language}
                            onChange={(e) => setProfile(prev => ({ ...prev, language: e.target.value }))}
                            className="input-field"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="btn-primary inline-flex items-center space-x-2"
                        >
                          <Save className="h-4 w-4" />
                          <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Plan</h2>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{billingInfo.planName} Plan</h3>
                          <p className="text-gray-600">{billingInfo.planPrice}</p>
                          <p className="text-sm text-gray-500">Next billing: {new Date(billingInfo.nextBillingDate).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            billingInfo.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {billingInfo.status === 'active' ? 'Active' : 'Cancelled'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Upgrade Plan</h4>
                        <div className="space-y-3">
                          <button
                            onClick={() => handlePlanUpgrade('pro')}
                            className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900">Pro Plan</div>
                                <div className="text-sm text-gray-500">£12/month</div>
                              </div>
                              {profile.plan === 'pro' && <CheckCircle className="h-5 w-5 text-blue-600" />}
                            </div>
                          </button>
                          <button
                            onClick={() => handlePlanUpgrade('business')}
                            className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900">Business Plan</div>
                                <div className="text-sm text-gray-500">£35/month</div>
                              </div>
                              {profile.plan === 'business' && <CheckCircle className="h-5 w-5 text-blue-600" />}
                            </div>
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Payment Method</h4>
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                            <div>
                              <div className="font-medium text-gray-900">{billingInfo.cardBrand} ending in {billingInfo.cardLast4}</div>
                              <div className="text-sm text-gray-500">Expires 12/25</div>
                            </div>
                            <button className="ml-auto text-blue-600 hover:text-blue-700 text-sm font-medium">
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6 mt-6">
                      <button
                        onClick={handlePlanCancel}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Cancel Subscription
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="card">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                      
                      {Object.entries(notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </div>
                            <div className="text-sm text-gray-500">
                              {key === 'emailNotifications' && 'Receive important updates via email'}
                              {key === 'paymentReminders' && 'Get notified about upcoming payments'}
                              {key === 'overdueAlerts' && 'Alert when invoices become overdue'}
                              {key === 'weeklyReports' && 'Weekly summary of your business'}
                              {key === 'marketingEmails' && 'Product updates and tips'}
                            </div>
                          </div>
                          <button
                            onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="card">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Appearance & Theme</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['light', 'dark', 'auto'].map((theme) => (
                          <button
                            key={theme}
                            onClick={() => setAppearance(prev => ({ ...prev, theme }))}
                            className={`p-4 border-2 rounded-lg text-center transition-colors ${
                              appearance.theme === theme
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="font-medium text-gray-900 capitalize">{theme}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Accent Color</label>
                      <div className="grid grid-cols-6 gap-3">
                        {['blue', 'purple', 'green', 'red', 'yellow', 'pink'].map((color) => (
                          <button
                            key={color}
                            onClick={() => setAppearance(prev => ({ ...prev, accentColor: color }))}
                            className={`w-12 h-12 rounded-full border-2 transition-transform ${
                              appearance.accentColor === color
                                ? 'border-gray-900 scale-110'
                                : 'border-gray-200 hover:scale-105'
                            } bg-${color}-500`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Compact Mode</div>
                        <div className="text-sm text-gray-500">Reduce spacing for more content</div>
                      </div>
                      <button
                        onClick={() => setAppearance(prev => ({ ...prev, compactMode: !prev.compactMode }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          appearance.compactMode ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            appearance.compactMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input type="password" className="input-field" placeholder="••••••••" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input type="password" className="input-field" placeholder="••••••••" />
                          </div>
                        </div>
                        <button className="btn-primary mt-4">Update Password</button>
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">2FA is disabled</div>
                            <div className="text-sm text-gray-500">Add an extra layer of security to your account</div>
                          </div>
                          <button className="btn-primary">Enable 2FA</button>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Data Export</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">Export your data</div>
                            <div className="text-sm text-gray-500">Download all your invoices and data</div>
                          </div>
                          <button className="btn-secondary inline-flex items-center space-x-2">
                            <Download className="h-4 w-4" />
                            <span>Export</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
