'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MondayStyleWelcome from '@/components/MondayStyleWelcome';
import { 
  Sparkles, 
  Target, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Gift,
  Star
} from 'lucide-react';

interface UserProfile {
  name: string
  businessType: 'freelancer' | 'agency' | 'small-business' | 'enterprise'
  industry: string
  goals: string[]
  template: string
}

export default function OnboardingPage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  // Check if user has already completed onboarding
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem('invoicezap_onboardingComplete');
      if (completed === 'true') {
        router.push('/dashboard');
      }
    }
  }, [router]);

  const handleWelcomeComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowWelcome(false);
    
    // Show success and redirect to dashboard
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  if (showWelcome) {
    return <MondayStyleWelcome onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🎉 Welcome Complete!
        </h1>
        <p className="text-gray-600">
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  );
}
