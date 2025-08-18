'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  Calendar,
  Search,
  MoreVertical,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ArrowUpRight,
  Users,
  PieChart,
  Target,
  Award,
  Zap,
  Star,
  Trophy,
  Flame,
  Gift,
  ChevronRight,
  Eye,
  Send,
  Download,
  Sparkles,
  ArrowRight,
  Play,
  BookOpen,
  Settings,
  CreditCard
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import OnboardingProgress from '@/components/OnboardingProgress'

export default function DashboardPage() {
  const { user, profile, signOut } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isNewUser, setIsNewUser] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [hasInvoices, setHasInvoices] = useState(false)
  const [hasClients, setHasClients] = useState(false)

  // Check if user just completed onboarding and check for existing data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const justCompleted = sessionStorage.getItem('justCompletedOnboarding')
      const storedProfile = localStorage.getItem('invoicezap_userProfile')
      const storedInvoices = localStorage.getItem('invoicezap_invoices')
      const storedClients = localStorage.getItem('invoicezap_clients')
      
      if (justCompleted === 'true') {
        setIsNewUser(true)
        setShowCelebration(true)
        sessionStorage.removeItem('justCompletedOnboarding')
        
        // Auto-hide celebration after 5 seconds
        setTimeout(() => {
          setShowCelebration(false)
        }, 5000)
      }
      
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile))
      }

      // Check if user has any real data
      if (storedInvoices) {
        const invoices = JSON.parse(storedInvoices)
        setHasInvoices(invoices.length > 0)
      }
      
      if (storedClients) {
        const clients = JSON.parse(storedClients)
        setHasClients(clients.length > 0)
      }
    }
  }, [])

  // Fresh start data for new users
  const freshStats = {
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    totalRevenue: 0,
    thisMonth: 0,
    thisWeek: 0
  }

  // Demo data for users with existing data
  const demoStats = {
    totalInvoices: 24,
    paidInvoices: 18,
    pendingInvoices: 4,
    overdueInvoices: 2,
    totalRevenue: 15420,
    thisMonth: 3200,
    thisWeek: 800
  }

  const stats = hasInvoices ? demoStats : freshStats

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'draft':
        return <FileText className="h-5 w-5 text-gray-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome celebration for new users */}
        {showCelebration && (
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">🎉 Welcome to InvoiceZap!</h2>
                  <p className="text-lg opacity-90 mb-3">
                    {userProfile ? (
                      <>Your {userProfile.businessType} workspace is ready! You've selected the perfect {userProfile.template} template.</>
                    ) : (
                      'Your personalized workspace is ready to help you create professional invoices!'
                    )}
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                      ✨ Fresh Start
                    </div>
                    <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                      🎯 Personalized
                    </div>
                    <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                      🚀 Ready to Go
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowCelebration(false)}
                  className="text-white/70 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Onboarding Progress for New Users */}
        <OnboardingProgress userId={user?.id} className="mb-8" />

        {/* HERO SECTION - Fresh Start for New Users */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Hey {profile?.first_name}! 👋
              </h1>
              <p className="text-xl opacity-90 mb-4">
                {hasInvoices 
                  ? "You're crushing it! Here's your business snapshot."
                  : "Ready to start getting paid? Let's create your first invoice!"
                }
              </p>
              
              {!hasInvoices && (
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5" />
                    <span className="text-lg font-semibold">Fresh Start</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span className="font-semibold">Ready to grow</span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-right">
              <Link 
                href="/invoice/new" 
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center space-x-3 pulse-animation"
              >
                <Plus className="h-6 w-6" />
                <span>{hasInvoices ? 'Create Invoice' : 'Create Your First Invoice'}</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* FRESH START SECTION - For New Users */}
        {!hasInvoices && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome to Your Fresh Start!</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Your dashboard is clean and ready. Let's get you set up with everything you need to start invoicing like a pro.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Add Your First Client</h3>
                  <p className="text-sm text-gray-600 mb-4">Start building your client database</p>
                  <Link 
                    href="/clients" 
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Create Your First Invoice</h3>
                  <p className="text-sm text-gray-600 mb-4">Generate a professional invoice in minutes</p>
                  <Link 
                    href="/invoice/new" 
                    className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
                  >
                    <span>Create Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Customize Your Profile</h3>
                  <p className="text-sm text-gray-600 mb-4">Add your business details and branding</p>
                  <Link 
                    href="/settings" 
                    className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    <span>Set Up</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* STATS SECTION - Show different content for new vs existing users */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Money Made */}
          <div className="bg-white rounded-xl p-6 border-l-4 border-green-500 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Money Made</p>
                <p className="text-3xl font-bold text-gray-900">
                  {hasInvoices ? `£${stats.totalRevenue.toLocaleString()}` : '£0'}
                </p>
                <p className="text-sm text-green-600 font-semibold mt-1">
                  {hasInvoices ? `+£${stats.thisWeek} this week` : 'Start invoicing to earn'}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Invoices Sent */}
          <div className="bg-white rounded-xl p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Invoices Sent</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalInvoices}</p>
                <p className="text-sm text-blue-600 font-semibold mt-1">
                  {hasInvoices ? `${stats.paidInvoices} paid` : 'Create your first invoice'}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Send className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Need Attention */}
          <div className="bg-white rounded-xl p-6 border-l-4 border-orange-500 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Need Attention</p>
                <p className="text-3xl font-bold text-gray-900">
                  {hasInvoices ? stats.pendingInvoices + stats.overdueInvoices : 0}
                </p>
                <p className="text-sm text-orange-600 font-semibold mt-1">
                  {hasInvoices ? `${stats.overdueInvoices} overdue` : 'All caught up'}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* All Good */}
          <div className="bg-white rounded-xl p-6 border-l-4 border-green-500 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">All Good</p>
                <p className="text-3xl font-bold text-gray-900">{stats.paidInvoices}</p>
                <p className="text-sm text-green-600 font-semibold mt-1">
                  {hasInvoices ? 'Paid on time' : 'Ready to start'}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS - Always visible */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/invoice/new" className="bg-primary-500 hover:bg-primary-600 text-white p-6 rounded-xl transition-all duration-200 hover:shadow-lg group">
              <div className="flex items-center space-x-4">
                <Plus className="h-8 w-8 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-bold text-lg">Create Invoice</h3>
                  <p className="opacity-90">{hasInvoices ? 'Start earning money' : 'Create your first invoice'}</p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link href="/clients" className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-xl transition-all duration-200 hover:shadow-lg group">
              <div className="flex items-center space-x-4">
                <Users className="h-8 w-8 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-bold text-lg">Add Client</h3>
                  <p className="opacity-90">{hasClients ? 'Grow your business' : 'Add your first client'}</p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link href="/invoices" className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-xl transition-all duration-200 hover:shadow-lg group">
              <div className="flex items-center space-x-4">
                <Eye className="h-8 w-8 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-bold text-lg">View All</h3>
                  <p className="opacity-90">{hasInvoices ? 'See everything' : 'View your invoices'}</p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* EMPTY STATE OR CONTENT - Show different content based on user state */}
        {!hasInvoices ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Getting Started Guide */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Getting Started Guide</h2>
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Add Your Business Details</h3>
                      <p className="text-sm text-gray-600">Set up your profile and branding</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Add Your First Client</h3>
                      <p className="text-sm text-gray-600">Start building your client database</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Create Your First Invoice</h3>
                      <p className="text-sm text-gray-600">Generate a professional invoice</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link 
                  href="/onboarding" 
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <span>View Full Guide</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Help & Resources */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Help & Resources</h2>
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              
              <div className="space-y-4">
                <Link href="/templates" className="block p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Browse Templates</h3>
                      <p className="text-sm text-gray-600">Choose from professional invoice templates</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 ml-auto" />
                  </div>
                </Link>
                
                <Link href="/payment-providers" className="block p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 hover:border-green-300 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Payment Setup</h3>
                      <p className="text-sm text-gray-600">Connect your payment processor</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 ml-auto" />
                  </div>
                </Link>
                
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Play className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Watch Tutorial</h3>
                      <p className="text-sm text-gray-600">Learn how to use InvoiceZap effectively</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Show regular dashboard content for users with data
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Recent Invoices</h2>
                  <Link href="/invoices" className="text-blue-600 hover:text-blue-700 font-medium">
                    View All
                  </Link>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No invoices yet. Create your first invoice to get started!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="text-center py-4 text-gray-500">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Stats will appear here once you create invoices</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}