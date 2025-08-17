'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Lock, Crown, Zap } from 'lucide-react'

interface FeatureGateProps {
  children: ReactNode
  requiredPlan: 'free' | 'pro' | 'business'
  featureName: string
  fallback?: ReactNode
}

export default function FeatureGate({ 
  children, 
  requiredPlan, 
  featureName, 
  fallback 
}: FeatureGateProps) {
  const { profile } = useAuth()
  
  // Plan hierarchy: free < pro < business
  const planHierarchy: Record<string, number> = { free: 0, pro: 1, business: 2 }
  const userPlanLevel = planHierarchy[profile?.plan || 'free'] || 0
  const requiredPlanLevel = planHierarchy[requiredPlan] || 0
  
  const hasAccess = userPlanLevel >= requiredPlanLevel

  if (hasAccess) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-6 text-center">
      <div className="flex justify-center mb-4">
        {requiredPlan === 'pro' ? (
          <Crown className="h-12 w-12 text-yellow-500" />
        ) : requiredPlan === 'business' ? (
          <Zap className="h-12 w-12 text-purple-500" />
        ) : (
          <Lock className="h-12 w-12 text-gray-400" />
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {featureName} - {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)} Feature
      </h3>
      
      <p className="text-gray-600 mb-4">
        {requiredPlan === 'pro' 
          ? 'Upgrade to Pro to unlock this feature and get access to premium templates, custom branding, and advanced analytics.'
          : requiredPlan === 'business'
          ? 'Upgrade to Business to unlock team collaboration, advanced reporting, and API access.'
          : 'This feature requires a paid plan.'
        }
      </p>
      
      <button
        onClick={() => window.location.href = '/settings'}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
      >
        Upgrade Now
      </button>
    </div>
  )
}

// Convenience components for common features
export function ProFeature({ children, featureName, fallback }: Omit<FeatureGateProps, 'requiredPlan'>) {
  return (
    <FeatureGate requiredPlan="pro" featureName={featureName} fallback={fallback}>
      {children}
    </FeatureGate>
  )
}

export function BusinessFeature({ children, featureName, fallback }: Omit<FeatureGateProps, 'requiredPlan'>) {
  return (
    <FeatureGate requiredPlan="business" featureName={featureName} fallback={fallback}>
      {children}
    </FeatureGate>
  )
}
