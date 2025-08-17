'use client';

import { useState, useEffect } from 'react';
import { 
  TemplateRecommender, 
  UserProfile, 
  OnboardingQuestion, 
  TemplateRecommendation,
  QUICK_START_PROFILES,
  Goal
} from '@/lib/templateRecommender';
import { TemplateManager } from '@/lib/templateManager';
import { 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  Target, 
  Zap, 
  Star,
  ChevronRight,
  Play,
  Trophy,
  Gift
} from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (userProfile: UserProfile, recommendations: TemplateRecommendation[]) => void;
  onSkip: () => void;
}

export default function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({});
  const [recommendations, setRecommendations] = useState<TemplateRecommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedQuickStart, setSelectedQuickStart] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const templateRecommender = TemplateRecommender.getInstance();
  const templateManager = TemplateManager.getInstance();

  const totalSteps = 5; // Business type, industry, design preference, goals, results

  useEffect(() => {
    setProgress((currentStep / totalSteps) * 100);
  }, [currentStep, totalSteps]);

  const handleAnswer = (questionId: string, value: any) => {
    setUserProfile(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateRecommendations();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateRecommendations = () => {
    // Fill in default values for missing fields
    const completeProfile: UserProfile = {
      id: 'temp-id',
      businessType: userProfile.businessType || 'freelancer',
      industry: userProfile.industry || 'technology',
      companySize: userProfile.companySize || 'solo',
      designPreference: userProfile.designPreference || 'modern',
      colorPreference: userProfile.colorPreference || 'blue',
      targetAudience: userProfile.targetAudience || 'clients',
      invoiceFrequency: userProfile.invoiceFrequency || 'monthly',
      budget: userProfile.budget || 'value-focused',
      experience: userProfile.experience || 'intermediate',
      goals: userProfile.goals || ['look-professional']
    };

    const recs = templateRecommender.calculateRecommendation(completeProfile);
    setRecommendations(recs);
    setShowRecommendations(true);
  };

  const handleQuickStart = (profileKey: string) => {
    const profile = QUICK_START_PROFILES[profileKey];
    setUserProfile(profile);
    setSelectedQuickStart(profileKey);
    
    // Auto-generate recommendations for quick start
    const completeProfile: UserProfile = {
      id: 'temp-id',
      businessType: profile.businessType || 'freelancer',
      industry: profile.industry || 'technology',
      companySize: profile.companySize || 'solo',
      designPreference: profile.designPreference || 'modern',
      colorPreference: profile.colorPreference || 'blue',
      targetAudience: profile.targetAudience || 'clients',
      invoiceFrequency: profile.invoiceFrequency || 'monthly',
      budget: profile.budget || 'value-focused',
      experience: profile.experience || 'intermediate',
      goals: profile.goals || ['look-professional']
    };

    const recs = templateRecommender.calculateRecommendation(completeProfile);
    setRecommendations(recs);
    setShowRecommendations(true);
  };

  const handleTemplateSelect = (templateId: string) => {
    // Find the selected template
    const template = templateManager.getTemplateById(templateId);
    if (template) {
      // Complete the onboarding with the selected template
      const completeProfile: UserProfile = {
        id: 'temp-id',
        businessType: userProfile.businessType || 'freelancer',
        industry: userProfile.industry || 'technology',
        companySize: userProfile.companySize || 'solo',
        designPreference: userProfile.designPreference || 'modern',
        colorPreference: userProfile.colorPreference || 'blue',
        targetAudience: userProfile.targetAudience || 'clients',
        invoiceFrequency: userProfile.invoiceFrequency || 'monthly',
        budget: userProfile.budget || 'value-focused',
        experience: userProfile.experience || 'intermediate',
        goals: userProfile.goals || ['look-professional']
      };

      onComplete(completeProfile, recommendations);
    }
  };

  const getCurrentQuestion = (): OnboardingQuestion | null => {
    const questions = templateRecommender.getOnboardingQuestions(userProfile);
    return questions[currentStep] || null;
  };

  const renderQuestion = (question: OnboardingQuestion) => {
    switch (question.type) {
      case 'choice':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {question.options?.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(question.id, option.value)}
                  className={`p-6 border-2 rounded-lg text-center transition-all hover:scale-105 ${
                    userProfile[question.id as keyof UserProfile] === option.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{option.icon}</div>
                  <div className="font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'multiChoice':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {question.options?.map((option) => {
                const currentGoals = userProfile.goals || [];
                const isSelected = currentGoals.includes(option.value as Goal);
                
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      if (isSelected) {
                        handleAnswer(question.id, currentGoals.filter(g => g !== option.value as Goal));
                      } else {
                        const maxSelections = question.maxSelections || 3;
                        if (currentGoals.length < maxSelections) {
                          handleAnswer(question.id, [...currentGoals, option.value as Goal]);
                        }
                      }
                    }}
                    className={`p-6 border-2 rounded-lg text-center transition-all hover:scale-105 ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{option.icon}</div>
                    <div className="font-medium">{option.label}</div>
                    {isSelected && (
                      <div className="mt-2">
                        <CheckCircle className="h-5 w-5 text-primary-600 mx-auto" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="text-sm text-gray-500 text-center">
              Select up to {question.maxSelections} goals
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (showRecommendations) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full mb-6">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎯 Your Perfect Template Match!
            </h1>
            <p className="text-xl text-gray-600">
              Based on your preferences, here are the templates we recommend for you
            </p>
          </div>

          {/* Recommendations */}
          <div className="space-y-6 mb-12">
            {recommendations.map((rec, index) => {
              const template = templateManager.getTemplateById(rec.templateId);
              if (!template) return null;

              const matchBadge = {
                perfect: { label: 'Perfect Match', color: 'bg-green-100 text-green-800', icon: '🏆' },
                excellent: { label: 'Excellent Match', color: 'bg-blue-100 text-blue-800', icon: '⭐' },
                good: { label: 'Good Match', color: 'bg-yellow-100 text-yellow-800', icon: '👍' },
                decent: { label: 'Decent Match', color: 'bg-gray-100 text-gray-800', icon: '✅' }
              }[rec.matchType];

              return (
                <div
                  key={rec.templateId}
                  className={`bg-white rounded-2xl shadow-lg border-2 transition-all hover:scale-105 ${
                    index === 0 ? 'border-primary-500 shadow-primary-100' : 'border-gray-200'
                  }`}
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                          <h3 className="text-2xl font-bold text-gray-900">{template.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${matchBadge.color}`}>
                            {matchBadge.icon} {matchBadge.label}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary-600" />
                            <span className="text-sm text-gray-600">{rec.category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm text-gray-600">{Math.round(rec.score * 100)}% Match</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-purple-600" />
                            <span className="text-sm text-gray-600">{Math.round(rec.confidence * 100)}% Confidence</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {rec.reasons.map((reason, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-gray-700">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-3xl mb-2">📄</div>
                        <div className="text-sm text-gray-500 capitalize">{template.category}</div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      {index === 0 && (
                        <button
                          onClick={() => handleTemplateSelect(rec.templateId)}
                          className="flex-1 bg-gradient-to-r from-primary-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                        >
                          <Gift className="h-5 w-5" />
                          Use This Template
                        </button>
                      )}
                      <button
                        onClick={() => handleTemplateSelect(rec.templateId)}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                          index === 0
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-primary-500 text-white hover:bg-primary-600'
                        }`}
                      >
                        {index === 0 ? 'Try Alternative' : 'Select Template'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowRecommendations(false)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
            >
              ← Back to Questions
            </button>
            <button
              onClick={onSkip}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
            >
              Skip for Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-primary-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Quick Start Options (Step 0) */}
        {currentStep === 0 && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full mb-6">
              <Play className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🚀 Let's Find Your Perfect Template!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Answer a few questions or choose a quick start profile to get personalized template recommendations
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {Object.entries(QUICK_START_PROFILES).map(([key, profile]) => (
                <button
                  key={key}
                  onClick={() => handleQuickStart(key)}
                  className={`p-6 border-2 rounded-xl text-center transition-all hover:scale-105 ${
                    selectedQuickStart === key
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="text-3xl mb-3">
                    {key === 'freelancer-designer' ? '🎨' : 
                     key === 'marketing-agency' ? '📢' :
                     key === 'tech-consultant' ? '💻' : '🏥'}
                  </div>
                  <div className="font-semibold text-lg mb-2">
                    {key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {profile.businessType} • {profile.industry}
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center">
              <div className="text-gray-500 mb-4">or</div>
              <button
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-primary-500 text-primary-700 rounded-lg font-medium hover:bg-primary-50 transition-all"
              >
                Answer Questions Manually
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Questions */}
        {currentStep > 0 && (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {getCurrentQuestion()?.question}
              </h2>
              <p className="text-lg text-gray-600">
                This helps us recommend the perfect template for your business
              </p>
            </div>

            <div className="mb-12">
              {getCurrentQuestion() && renderQuestion(getCurrentQuestion()!)}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Back
              </button>

              <div className="flex gap-4">
                <button
                  onClick={onSkip}
                  className="px-6 py-3 text-gray-500 hover:text-gray-700 transition-all"
                >
                  Skip for Now
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="px-8 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {currentStep === totalSteps - 1 ? 'Get Recommendations' : 'Next'}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  function canProceed(): boolean {
    const question = getCurrentQuestion();
    if (!question) return false;

    if (question.required) {
      const value = userProfile[question.id as keyof UserProfile];
      if (question.type === 'multiChoice') {
        return Array.isArray(value) && value.length > 0;
      }
      return value !== undefined && value !== '';
    }

    return true;
  }
}
