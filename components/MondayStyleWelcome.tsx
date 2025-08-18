'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  User,
  Building,
  Palette,
  Target,
  Zap,
  Play,
  Users,
  Laptop,
  Heart,
  Star,
  Shield,
  Globe
} from 'lucide-react'
import toast from 'react-hot-toast'
import { initializeFreshDashboard } from '@/lib/dataService'

interface WelcomeProps {
  onComplete: (profile: UserProfile) => void
}

interface UserProfile {
  name: string
  businessType: 'freelancer' | 'agency' | 'small-business' | 'enterprise'
  industry: string
  goals: string[]
  template: string
}

const businessTypes = [
  {
    id: 'freelancer',
    title: 'Freelancer / Solo',
    subtitle: 'Working independently',
    icon: User,
    color: 'bg-blue-500',
    description: 'Perfect for individual professionals'
  },
  {
    id: 'agency',
    title: 'Agency / Studio',
    subtitle: 'Creative team (2-20 people)',
    icon: Users,
    color: 'bg-purple-500',
    description: 'Great for design studios and agencies'
  },
  {
    id: 'small-business',
    title: 'Small Business',
    subtitle: 'Growing company (5-50 people)',
    icon: Building,
    color: 'bg-green-500',
    description: 'Ideal for established businesses'
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    subtitle: 'Large organization (50+ people)',
    icon: Globe,
    color: 'bg-orange-500',
    description: 'Built for enterprise needs'
  }
]

const industries = [
  { id: 'design', name: 'Design & Creative', icon: '🎨' },
  { id: 'tech', name: 'Technology', icon: '💻' },
  { id: 'marketing', name: 'Marketing & Advertising', icon: '📢' },
  { id: 'consulting', name: 'Consulting', icon: '💼' },
  { id: 'finance', name: 'Finance & Accounting', icon: '💰' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'retail', name: 'Retail & E-commerce', icon: '🛍️' },
  { id: 'other', name: 'Other', icon: '🌟' }
]

const goals = [
  { id: 'professional', name: 'Look more professional', icon: '✨' },
  { id: 'faster', name: 'Create invoices faster', icon: '⚡' },
  { id: 'payment', name: 'Get paid quicker', icon: '💳' },
  { id: 'branding', name: 'Strengthen my branding', icon: '🎯' },
  { id: 'tracking', name: 'Better expense tracking', icon: '📊' },
  { id: 'automation', name: 'Automate my workflow', icon: '🔄' }
]

const templates = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    preview: 'Clean and professional',
    color: 'from-blue-400 to-blue-600',
    recommended: ['freelancer', 'consulting']
  },
  {
    id: 'creative-bold',
    name: 'Creative Bold',
    preview: 'Eye-catching design',
    color: 'from-purple-400 to-pink-600',
    recommended: ['agency', 'design']
  },
  {
    id: 'corporate',
    name: 'Corporate Professional',
    preview: 'Traditional business style',
    color: 'from-gray-400 to-gray-600',
    recommended: ['small-business', 'enterprise']
  }
]

export default function MondayStyleWelcome({ onComplete }: WelcomeProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    goals: []
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const router = useRouter()

  const steps = [
    'Welcome',
    'Business Type',
    'Industry',
    'Goals',
    'Template',
    'Complete'
  ]

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handleBusinessTypeSelect = (type: string) => {
    setProfile(prev => ({ ...prev, businessType: type as any }))
    setTimeout(handleNext, 500)
  }

  const handleIndustrySelect = (industry: string) => {
    setProfile(prev => ({ ...prev, industry }))
    setTimeout(handleNext, 500)
  }

  const handleGoalToggle = (goalId: string) => {
    setProfile(prev => {
      const currentGoals = prev.goals || []
      const newGoals = currentGoals.includes(goalId)
        ? currentGoals.filter(g => g !== goalId)
        : [...currentGoals, goalId]
      return { ...prev, goals: newGoals }
    })
  }

  const handleTemplateSelect = (templateId: string) => {
    setProfile(prev => ({ ...prev, template: templateId }))
    setTimeout(handleNext, 500)
  }

  const handleComplete = () => {
    const completeProfile: UserProfile = {
      name: profile.name || 'User',
      businessType: profile.businessType || 'freelancer',
      industry: profile.industry || 'other',
      goals: profile.goals || [],
      template: profile.template || 'modern-minimal'
    }

    // Reset user data for new account and set completion flags
    if (typeof window !== 'undefined') {
      // Initialize fresh dashboard for new users
      initializeFreshDashboard()
      
      // Set user profile and onboarding completion
      localStorage.setItem('invoicezap_userProfile', JSON.stringify(completeProfile))
      localStorage.setItem('invoicezap_onboardingComplete', 'true')
      sessionStorage.setItem('justCompletedOnboarding', 'true')
    }

    toast.success('🎉 Welcome to InvoiceZap! Your account is ready!')
    onComplete(completeProfile)
  }

  const getRecommendedTemplate = () => {
    if (!profile.businessType) return templates[0]
    return templates.find(t => t.recommended.includes(profile.businessType!)) || templates[0]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">InvoiceZap</span>
            </div>
            <div className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            
            {/* Step 0: Welcome */}
            {currentStep === 0 && (
              <div className="text-center py-16">
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Welcome to InvoiceZap! 👋
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Let's set up your account in under 2 minutes. We'll personalize everything to match your business perfectly.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <Zap className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast Setup</h3>
                    <p className="text-gray-600 text-sm">Get started in minutes, not hours</p>
                  </div>
                  <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <Palette className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Personalized Templates</h3>
                    <p className="text-gray-600 text-sm">Perfect designs for your business</p>
                  </div>
                  <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Fresh Start</h3>
                    <p className="text-gray-600 text-sm">Clean slate, ready for your success</p>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Let's Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            )}

            {/* Step 1: Business Type */}
            {currentStep === 1 && (
              <div className="py-16">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    What best describes your business?
                  </h2>
                  <p className="text-lg text-gray-600">
                    This helps us recommend the perfect templates and features
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {businessTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <div
                        key={type.id}
                        onClick={() => handleBusinessTypeSelect(type.id)}
                        className={`p-8 bg-white rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${
                          profile.businessType === type.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className={`w-16 h-16 ${type.color} rounded-2xl flex items-center justify-center mb-4`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{type.title}</h3>
                        <p className="text-gray-600 mb-3">{type.subtitle}</p>
                        <p className="text-sm text-gray-500">{type.description}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Industry */}
            {currentStep === 2 && (
              <div className="py-16">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    What industry are you in?
                  </h2>
                  <p className="text-lg text-gray-600">
                    We'll customize your experience based on your industry
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {industries.map((industry) => (
                    <div
                      key={industry.id}
                      onClick={() => handleIndustrySelect(industry.id)}
                      className={`p-6 bg-white rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
                        profile.industry === industry.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-3xl mb-3 text-center">{industry.icon}</div>
                      <h3 className="font-semibold text-gray-900 text-center text-sm">{industry.name}</h3>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Goals */}
            {currentStep === 3 && (
              <div className="py-16">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    What are your main goals?
                  </h2>
                  <p className="text-lg text-gray-600">
                    Select all that apply - we'll prioritize these features
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
                  {goals.map((goal) => {
                    const isSelected = profile.goals?.includes(goal.id)
                    return (
                      <div
                        key={goal.id}
                        onClick={() => handleGoalToggle(goal.id)}
                        className={`p-6 bg-white rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{goal.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                          </div>
                          {isSelected && (
                            <CheckCircle className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="text-center">
                  <button
                    onClick={handleNext}
                    disabled={!profile.goals?.length}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Template Selection */}
            {currentStep === 4 && (
              <div className="py-16">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Choose your perfect template
                  </h2>
                  <p className="text-lg text-gray-600">
                    Based on your preferences, here's what we recommend
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {templates.map((template, index) => {
                    const isRecommended = template.recommended.includes(profile.businessType!)
                    return (
                      <div
                        key={template.id}
                        onClick={() => handleTemplateSelect(template.id)}
                        className={`relative p-6 bg-white rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 ${
                          profile.template === template.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {isRecommended && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              ⭐ Recommended
                            </div>
                          </div>
                        )}
                        
                        <div className={`h-32 bg-gradient-to-br ${template.color} rounded-xl mb-4 flex items-center justify-center`}>
                          <div className="text-white text-4xl">📄</div>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                        <p className="text-gray-600 text-sm">{template.preview}</p>
                        
                        {profile.template === template.id && (
                          <div className="mt-4 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-blue-600" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {profile.template && (
                  <div className="text-center mt-8">
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                    >
                      Looks Perfect!
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Complete */}
            {currentStep === 5 && (
              <div className="text-center py-16">
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl mb-6">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    🎉 You're all set!
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">
                    Your personalized InvoiceZap workspace is ready. Let's create your first invoice!
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-md mx-auto mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Your Setup:</h3>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Business Type:</span>
                      <span className="font-medium capitalize">{profile.businessType?.replace('-', ' ')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Industry:</span>
                      <span className="font-medium capitalize">{industries.find(i => i.id === profile.industry)?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Template:</span>
                      <span className="font-medium">{templates.find(t => t.id === profile.template)?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Goals:</span>
                      <span className="font-medium">{profile.goals?.length} selected</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleComplete}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Start Creating Invoices
                  <Play className="ml-2 h-5 w-5" />
                </button>
              </div>
            )}

            {/* Navigation */}
            {currentStep > 0 && currentStep < 5 && (
              <div className="flex justify-between items-center mt-12">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-all"
                >
                  ← Back
                </button>
                
                {currentStep === 3 && (
                  <div className="text-center">
                    <button
                      onClick={handleNext}
                      disabled={!profile.goals?.length}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Skip for now
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
