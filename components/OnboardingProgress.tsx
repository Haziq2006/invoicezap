'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Circle, ArrowRight, Zap, Users, FileText, CreditCard, Settings } from 'lucide-react'
import Link from 'next/link'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
  completed: boolean
  required: boolean
}

interface OnboardingProgressProps {
  userId?: string
  className?: string
}

export default function OnboardingProgress({ userId, className = '' }: OnboardingProgressProps) {
  const [steps, setSteps] = useState<OnboardingStep[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check user progress from localStorage or API
    const checkProgress = () => {
      const userData = localStorage.getItem('invoicezap_user')
      const hasProfile = localStorage.getItem('invoicezap_userProfile')
      const hasClients = localStorage.getItem('invoicezap_clients')
      const hasInvoices = localStorage.getItem('invoicezap_invoices')
      const hasPaymentSetup = localStorage.getItem('invoicezap_paymentSetup')

      const onboardingSteps: OnboardingStep[] = [
        {
          id: 'profile',
          title: 'Complete Profile',
          description: 'Add your business details',
          icon: <Settings className="h-5 w-5" />,
          href: '/settings',
          completed: !!hasProfile,
          required: true
        },
        {
          id: 'clients',
          title: 'Add First Client',
          description: 'Start building your client list',
          icon: <Users className="h-5 w-5" />,
          href: '/clients',
          completed: !!hasClients,
          required: true
        },
        {
          id: 'invoice',
          title: 'Create First Invoice',
          description: 'Generate your first professional invoice',
          icon: <FileText className="h-5 w-5" />,
          href: '/invoice/new',
          completed: !!hasInvoices,
          required: true
        },
        {
          id: 'payment',
          title: 'Set Up Payments',
          description: 'Connect your payment processor',
          icon: <CreditCard className="h-5 w-5" />,
          href: '/settings?tab=billing',
          completed: !!hasPaymentSetup,
          required: false
        }
      ]

      setSteps(onboardingSteps)
      
      // Show if user hasn't completed all required steps
      const incompleteRequired = onboardingSteps.filter(step => step.required && !step.completed)
      setIsVisible(incompleteRequired.length > 0)
    }

    checkProgress()
    
    // Listen for storage changes
    const handleStorageChange = () => checkProgress()
    window.addEventListener('storage', handleStorageChange)
    
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [userId])

  const completedSteps = steps.filter(step => step.completed).length
  const requiredSteps = steps.filter(step => step.required).length
  const progress = requiredSteps > 0 ? (completedSteps / requiredSteps) * 100 : 0

  if (!isVisible) return null

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Zap className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Complete Your Setup</h3>
            <p className="text-sm text-gray-600">
              {completedSteps} of {requiredSteps} required steps completed
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</div>
          <div className="text-xs text-gray-500">Complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-blue-200 rounded-full h-2 mb-6">
        <div 
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step) => (
          <Link
            key={step.id}
            href={step.href}
            className={`block p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
              step.completed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-white border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${
                    step.completed ? 'text-green-800' : 'text-gray-900'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {step.description}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {step.required && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    Required
                  </span>
                )}
                {!step.completed && (
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      {progress < 100 && (
        <div className="mt-6 pt-4 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Complete setup to unlock all features
            </p>
            <Link
              href="/onboarding"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>Get Help</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Completion Celebration */}
      {progress === 100 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <div className="font-medium text-green-800">Setup Complete!</div>
              <div className="text-sm text-green-600">
                You're all set to start creating professional invoices
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
