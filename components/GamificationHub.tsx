'use client'

import { useState, useEffect } from 'react'
import { Trophy, Star, Zap, Target, Gift, Flame, Award } from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: Date
  xp: number
  category: 'invoice' | 'client' | 'revenue' | 'streak' | 'speed'
}

interface UserProgress {
  level: number
  xp: number
  xpToNext: number
  title: string
  streak: number
  totalInvoices: number
  totalRevenue: number
  achievements: Achievement[]
}

interface GamificationHubProps {
  userProgress: UserProgress
  onXpGain?: (amount: number, reason: string) => void
  onAchievementUnlock?: (achievement: Achievement) => void
  onLevelUp?: (newLevel: number) => void
}

export default function GamificationHub({ 
  userProgress, 
  onXpGain, 
  onAchievementUnlock,
  onLevelUp 
}: GamificationHubProps) {
  const [showLevelUpModal, setShowLevelUpModal] = useState(false)
  const [showAchievementModal, setShowAchievementModal] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)

  const progressPercentage = (userProgress.xp / userProgress.xpToNext) * 100

  const achievements: Achievement[] = [
    {
      id: 'first_invoice',
      title: 'Getting Started',
      description: 'Created your first invoice',
      icon: '🎯',
      earned: userProgress.totalInvoices > 0,
      xp: 50,
      category: 'invoice'
    },
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Created 5 invoices in one day',
      icon: '⚡',
      earned: false, // This would be calculated based on actual data
      xp: 100,
      category: 'speed'
    },
    {
      id: 'first_payment',
      title: 'Money Maker',
      description: 'Received your first payment',
      icon: '💰',
      earned: userProgress.totalRevenue > 0,
      xp: 75,
      category: 'revenue'
    },
    {
      id: 'streak_week',
      title: 'Consistent Creator',
      description: 'Maintained 7-day activity streak',
      icon: '🔥',
      earned: userProgress.streak >= 7,
      xp: 150,
      category: 'streak'
    },
    {
      id: 'client_collector',
      title: 'Network Builder',
      description: 'Added 10 clients',
      icon: '👥',
      earned: false, // Would be calculated based on client count
      xp: 125,
      category: 'client'
    },
    {
      id: 'revenue_milestone',
      title: 'Revenue Rockstar',
      description: 'Earned £1,000 total',
      icon: '🚀',
      earned: userProgress.totalRevenue >= 1000,
      xp: 200,
      category: 'revenue'
    }
  ]

  const levelTitles = [
    'Newbie',
    'Getting Started', 
    'Invoice Apprentice',
    'Invoice Ninja',
    'Business Builder',
    'Revenue Master',
    'Freelance Legend',
    'Invoice Guru',
    'Business Mogul',
    'Entrepreneurial Elite'
  ]

  const getCurrentTitle = (level: number) => {
    return levelTitles[Math.min(level - 1, levelTitles.length - 1)] || 'Legendary Creator'
  }

  const getNextMilestone = () => {
    const milestones = [
      { xp: 100, reward: 'Custom template unlock' },
      { xp: 500, reward: 'Priority support' },
      { xp: 1000, reward: 'Advanced analytics' },
      { xp: 2000, reward: 'White-label feature' },
      { xp: 5000, reward: 'Lifetime discount' }
    ]
    
    return milestones.find(m => userProgress.xp < m.xp) || milestones[milestones.length - 1]
  }

  const recentAchievements = achievements.filter(a => a.earned).slice(-3)

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      {/* Level Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Level {userProgress.level}
              </h3>
              <p className="text-sm text-gray-600">{getCurrentTitle(userProgress.level)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500">
              {userProgress.xp}/{userProgress.xpToNext} XP
            </p>
            <p className="text-xs text-gray-400">
              {userProgress.xpToNext - userProgress.xp} to next level
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="progress-bar">
          <div 
            className="progress-fill bg-gradient-to-r from-blue-500 to-purple-600"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Streak Counter */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg mb-6">
        <div className="flex items-center space-x-3">
          <Flame className="h-6 w-6 text-orange-500" />
          <div>
            <p className="font-semibold text-gray-900">{userProgress.streak} Day Streak</p>
            <p className="text-sm text-gray-600">Keep it going!</p>
          </div>
        </div>
        <div className="text-orange-500 text-2xl font-bold">🔥</div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{userProgress.totalInvoices}</p>
          <p className="text-sm text-gray-600">Invoices Created</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">£{userProgress.totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Total Earned</p>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Star className="h-5 w-5 text-yellow-500 mr-2" />
          Recent Achievements
        </h4>
        <div className="space-y-2">
          {recentAchievements.length > 0 ? (
            recentAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
                <span className="text-xl">{achievement.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{achievement.title}</p>
                  <p className="text-xs text-gray-600">{achievement.description}</p>
                </div>
                <span className="text-xs font-semibold text-yellow-700 bg-yellow-200 px-2 py-1 rounded">
                  +{achievement.xp} XP
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">Complete tasks to earn achievements!</p>
          )}
        </div>
      </div>

      {/* Next Milestone */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="h-5 w-5 text-purple-500" />
            <div>
              <p className="font-medium text-gray-900">Next Milestone</p>
              <p className="text-sm text-gray-600">{getNextMilestone().reward}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-purple-600">
              {getNextMilestone().xp - userProgress.xp} XP to go
            </p>
          </div>
        </div>
      </div>

      {/* Level Up Modal */}
      {showLevelUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center level-up-notification">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Level Up!</h2>
            <p className="text-xl text-gray-600 mb-4">
              You're now Level {userProgress.level}
            </p>
            <p className="text-lg font-semibold text-purple-600 mb-6">
              {getCurrentTitle(userProgress.level)}
            </p>
            <button
              onClick={() => setShowLevelUpModal(false)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}

      {/* Achievement Modal */}
      {showAchievementModal && newAchievement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center achievement-unlock">
            <div className="text-6xl mb-4">{newAchievement.icon}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Achievement Unlocked!</h2>
            <h3 className="text-xl font-semibold text-yellow-600 mb-2">{newAchievement.title}</h3>
            <p className="text-gray-600 mb-4">{newAchievement.description}</p>
            <p className="text-lg font-bold text-green-600 mb-6">+{newAchievement.xp} XP</p>
            <button
              onClick={() => {
                setShowAchievementModal(false)
                setNewAchievement(null)
              }}
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              Claim Reward
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
