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
  Download
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import OnboardingProgress from '@/components/OnboardingProgress'

export default function DashboardPage() {
  const { user, profile, signOut } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [streakDays, setStreakDays] = useState(7)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)

  // Check if user just completed onboarding
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const justCompleted = sessionStorage.getItem('justCompletedOnboarding')
      const storedProfile = localStorage.getItem('invoicezap_userProfile')
      
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
    }
  }, [])

  // Monday.com-style simple data structure
  const stats = {
    totalInvoices: 24,
    paidInvoices: 18,
    pendingInvoices: 4,
    overdueInvoices: 2,
    totalRevenue: 15420,
    thisMonth: 3200,
    thisWeek: 800,
    level: 3,
    xp: 750,
    xpToNext: 1000
  }

  // Gamification data
  const userLevel = {
    current: 3,
    title: "Invoice Ninja",
    xp: 750,
    xpToNext: 1000,
    progress: (750 / 1000) * 100
  }

  const achievements = [
    { id: 1, title: "First Invoice", desc: "Created your first invoice", earned: true, icon: "🎯" },
    { id: 2, title: "Speed Demon", desc: "Created 5 invoices in one day", earned: true, icon: "⚡" },
    { id: 3, title: "Payment Master", desc: "Received 10 payments", earned: false, icon: "💰" },
    { id: 4, title: "Streak King", desc: "7-day activity streak", earned: true, icon: "🔥" }
  ]

  const todaysTasks = [
    { id: 1, text: "Send 2 pending invoices", completed: false, xp: 50 },
    { id: 2, text: "Follow up on overdue payment", completed: false, xp: 30 },
    { id: 3, text: "Add new client", completed: true, xp: 25 }
  ]

  const recentInvoices = [
    {
      id: 'INV-001',
      client: 'Acme Corp',
      amount: 1200,
      status: 'paid',
      dueDate: '2024-01-15',
      issueDate: '2024-01-01'
    },
    {
      id: 'INV-002',
      client: 'TechStart Inc',
      amount: 850,
      status: 'pending',
      dueDate: '2024-01-20',
      issueDate: '2024-01-05'
    },
    {
      id: 'INV-003',
      client: 'Design Studio',
      amount: 2100,
      status: 'overdue',
      dueDate: '2024-01-10',
      issueDate: '2023-12-20'
    },
    {
      id: 'INV-004',
      client: 'Marketing Agency',
      amount: 650,
      status: 'draft',
      dueDate: null,
      issueDate: null
    }
  ]

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

        {/* HERO SECTION - Monday.com style */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Hey {profile?.first_name}! 👋
              </h1>
              <p className="text-xl opacity-90 mb-4">
                You're crushing it! Here's your business snapshot.
              </p>
              
              {/* Level & XP Bar */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-6 w-6" />
                  <span className="text-lg font-semibold">Level {userLevel.current}</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {userLevel.title}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Flame className="h-5 w-5" />
                  <span className="font-semibold">{streakDays} day streak</span>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className="bg-white/20 rounded-full p-1 w-80">
                <div 
                  className="bg-white rounded-full h-3 transition-all duration-500 ease-out"
                  style={{ width: `${userLevel.progress}%` }}
                ></div>
              </div>
              <p className="text-sm opacity-75 mt-2">
                {userLevel.xp}/{userLevel.xpToNext} XP to next level
              </p>
            </div>

            <div className="text-right">
              <Link 
                href="/invoice/new" 
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center space-x-3 pulse-animation"
              >
                <Plus className="h-6 w-6" />
                <span>Create Invoice</span>
                <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">+50 XP</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* SIMPLE STATS - Monday.com style */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Money Made */}
          <div className="bg-white rounded-xl p-6 border-l-4 border-green-500 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Money Made</p>
                <p className="text-3xl font-bold text-gray-900">£{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 font-semibold mt-1">+£{stats.thisWeek} this week</p>
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
                <p className="text-sm text-blue-600 font-semibold mt-1">{stats.paidInvoices} paid</p>
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
                <p className="text-3xl font-bold text-gray-900">{stats.pendingInvoices + stats.overdueInvoices}</p>
                <p className="text-sm text-orange-600 font-semibold mt-1">{stats.overdueInvoices} overdue</p>
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
                <p className="text-sm text-green-600 font-semibold mt-1">Paid on time</p>
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
                  <p className="opacity-90">Start earning money</p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link href="/clients" className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-xl transition-all duration-200 hover:shadow-lg group">
              <div className="flex items-center space-x-4">
                <Users className="h-8 w-8 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-bold text-lg">Add Client</h3>
                  <p className="opacity-90">Grow your business</p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link href="/invoices" className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-xl transition-all duration-200 hover:shadow-lg group">
              <div className="flex items-center space-x-4">
                <Eye className="h-8 w-8 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-bold text-lg">View All</h3>
                  <p className="opacity-90">See everything</p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* TODAY'S TASKS - Gamified */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Today's Tasks</h2>
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Earn XP by completing tasks!
                </span>
              </div>
              
              <div className="space-y-4">
                {todaysTasks.map((task) => (
                  <div key={task.id} className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    task.completed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200 hover:border-primary-300'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          task.completed 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-300 hover:border-primary-500'
                        }`}>
                          {task.completed && <CheckCircle className="h-3 w-3 text-white" />}
                        </div>
                        <span className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.text}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        task.completed 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        +{task.xp} XP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACHIEVEMENTS SIDEBAR */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Achievements</h2>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div key={achievement.id} className={`p-3 rounded-lg border ${
                  achievement.earned 
                    ? 'bg-yellow-50 border-yellow-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h3 className={`font-semibold text-sm ${
                        achievement.earned ? 'text-yellow-800' : 'text-gray-600'
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className="text-xs text-gray-500">{achievement.desc}</p>
                    </div>
                    {achievement.earned && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}