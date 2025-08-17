export interface UserProfile {
  id: string;
  businessType: BusinessType;
  industry: Industry;
  companySize: CompanySize;
  designPreference: DesignPreference;
  colorPreference: ColorPreference;
  targetAudience: TargetAudience;
  invoiceFrequency: InvoiceFrequency;
  budget: Budget;
  experience: Experience;
  goals: Goal[];
}

export interface TemplateRecommendation {
  templateId: string;
  score: number;
  reasons: string[];
  confidence: number;
  category: string;
  matchType: 'perfect' | 'excellent' | 'good' | 'decent';
}

export type BusinessType = 
  | 'freelancer' 
  | 'consultant' 
  | 'agency' 
  | 'startup' 
  | 'enterprise' 
  | 'nonprofit';

export type Industry = 
  | 'technology' 
  | 'marketing' 
  | 'design' 
  | 'consulting' 
  | 'healthcare' 
  | 'legal' 
  | 'finance' 
  | 'education' 
  | 'real-estate' 
  | 'retail' 
  | 'manufacturing' 
  | 'other';

export type CompanySize = 
  | 'solo' 
  | '2-5' 
  | '6-20' 
  | '21-50' 
  | '50+';

export type DesignPreference = 
  | 'modern' 
  | 'classic' 
  | 'minimal' 
  | 'creative' 
  | 'professional' 
  | 'bold';

export type ColorPreference = 
  | 'blue' 
  | 'green' 
  | 'purple' 
  | 'red' 
  | 'orange' 
  | 'neutral' 
  | 'branded';

export type TargetAudience = 
  | 'clients' 
  | 'customers' 
  | 'partners' 
  | 'investors' 
  | 'employees' 
  | 'government';

export type InvoiceFrequency = 
  | 'daily' 
  | 'weekly' 
  | 'monthly' 
  | 'quarterly' 
  | 'project-based';

export type Budget = 
  | 'budget-conscious' 
  | 'value-focused' 
  | 'premium' 
  | 'enterprise';

export type Experience = 
  | 'beginner' 
  | 'intermediate' 
  | 'advanced' 
  | 'expert';

export type Goal = 
  | 'increase-conversions' 
  | 'build-trust' 
  | 'save-time' 
  | 'look-professional' 
  | 'stand-out' 
  | 'scale-business';

export class TemplateRecommender {
  private static instance: TemplateRecommender;
  private templateScores: Map<string, Map<string, number>> = new Map();

  private constructor() {
    this.initializeTemplateScores();
  }

  static getInstance(): TemplateRecommender {
    if (!TemplateRecommender.instance) {
      TemplateRecommender.instance = new TemplateRecommender();
    }
    return TemplateRecommender.instance;
  }

  // Static methods for API usage
  static async getRecommendations(userProfile: Partial<UserProfile>, limit: number = 5): Promise<TemplateRecommendation[]> {
    const instance = TemplateRecommender.getInstance();
    const recommendations = instance.calculateRecommendation(userProfile as UserProfile);
    return recommendations.slice(0, limit);
  }

  static getQuickStartProfile(profileType: string): Partial<UserProfile> | null {
    return QUICK_START_PROFILES[profileType] || null;
  }

  static getAvailableQuickStartProfiles(): string[] {
    return Object.keys(QUICK_START_PROFILES);
  }

  private initializeTemplateScores() {
    // Modern Professional Template Scores
    const modernProfessionalScores = new Map<string, number>([
      ['businessType.freelancer', 0.8],
      ['businessType.consultant', 0.9],
      ['businessType.agency', 0.7],
      ['businessType.startup', 0.8],
      ['businessType.enterprise', 0.6],
      ['industry.technology', 0.9],
      ['industry.consulting', 0.9],
      ['industry.finance', 0.8],
      ['industry.legal', 0.7],
      ['companySize.solo', 0.8],
      ['companySize.2-5', 0.9],
      ['companySize.6-20', 0.8],
      ['designPreference.modern', 1.0],
      ['designPreference.professional', 0.9],
      ['colorPreference.blue', 0.9],
      ['colorPreference.neutral', 0.8],
      ['targetAudience.clients', 0.9],
      ['targetAudience.partners', 0.8],
      ['invoiceFrequency.monthly', 0.8],
      ['invoiceFrequency.project-based', 0.9],
      ['budget.value-focused', 0.8],
      ['budget.premium', 0.7],
      ['experience.intermediate', 0.8],
      ['experience.advanced', 0.9],
      ['goals.look-professional', 0.9],
      ['goals.build-trust', 0.9],
      ['goals.scale-business', 0.8]
    ]);
    this.templateScores.set('modern-professional', modernProfessionalScores);

    // Minimal Clean Template Scores
    const minimalCleanScores = new Map<string, number>([
      ['businessType.freelancer', 0.9],
      ['businessType.consultant', 0.7],
      ['businessType.startup', 0.8],
      ['industry.design', 0.9],
      ['industry.technology', 0.8],
      ['industry.education', 0.8],
      ['companySize.solo', 0.9],
      ['companySize.2-5', 0.8],
      ['designPreference.minimal', 1.0],
      ['designPreference.modern', 0.8],
      ['colorPreference.neutral', 0.9],
      ['colorPreference.branded', 0.7],
      ['targetAudience.clients', 0.8],
      ['targetAudience.customers', 0.7],
      ['invoiceFrequency.weekly', 0.8],
      ['invoiceFrequency.monthly', 0.7],
      ['budget.budget-conscious', 0.8],
      ['budget.value-focused', 0.7],
      ['experience.beginner', 0.8],
      ['experience.intermediate', 0.7],
      ['goals.save-time', 0.9],
      ['goals.look-professional', 0.7],
      ['goals.stand-out', 0.6]
    ]);
    this.templateScores.set('minimal-clean', minimalCleanScores);

    // Creative Bold Template Scores
    const creativeBoldScores = new Map<string, number>([
      ['businessType.agency', 0.9],
      ['businessType.startup', 0.8],
      ['businessType.consultant', 0.6],
      ['industry.marketing', 0.9],
      ['industry.design', 0.9],
      ['industry.retail', 0.8],
      ['industry.technology', 0.7],
      ['companySize.2-5', 0.8],
      ['companySize.6-20', 0.7],
      ['designPreference.creative', 1.0],
      ['designPreference.bold', 1.0],
      ['designPreference.modern', 0.7],
      ['colorPreference.purple', 0.9],
      ['colorPreference.orange', 0.8],
      ['colorPreference.branded', 0.8],
      ['targetAudience.customers', 0.9],
      ['targetAudience.clients', 0.7],
      ['invoiceFrequency.weekly', 0.8],
      ['invoiceFrequency.monthly', 0.7],
      ['budget.premium', 0.8],
      ['budget.value-focused', 0.7],
      ['experience.intermediate', 0.8],
      ['experience.advanced', 0.7],
      ['goals.stand-out', 0.9],
      ['goals.increase-conversions', 0.8],
      ['goals.scale-business', 0.7]
    ]);
    this.templateScores.set('creative-bold', creativeBoldScores);
  }

  // Calculate template recommendation score based on user profile
  calculateRecommendation(userProfile: UserProfile): TemplateRecommendation[] {
    const recommendations: TemplateRecommendation[] = [];
    const templates = ['modern-professional', 'minimal-clean', 'creative-bold'];

    templates.forEach(templateId => {
      const scores = this.templateScores.get(templateId);
      if (!scores) return;

      let totalScore = 0;
      let maxPossibleScore = 0;
      const reasons: string[] = [];
      let matchCount = 0;

      // Business Type Score
      const businessTypeScore = scores.get(`businessType.${userProfile.businessType}`) || 0;
      if (businessTypeScore > 0.7) {
        reasons.push(`Perfect for ${userProfile.businessType} businesses`);
        matchCount++;
      }
      totalScore += businessTypeScore;
      maxPossibleScore += 1;

      // Industry Score
      const industryScore = scores.get(`industry.${userProfile.industry}`) || 0;
      if (industryScore > 0.7) {
        reasons.push(`Ideal for ${userProfile.industry} industry`);
        matchCount++;
      }
      totalScore += industryScore;
      maxPossibleScore += 1;

      // Company Size Score
      const companySizeScore = scores.get(`companySize.${userProfile.companySize}`) || 0;
      if (companySizeScore > 0.7) {
        reasons.push(`Optimized for ${userProfile.companySize} companies`);
        matchCount++;
      }
      totalScore += companySizeScore;
      maxPossibleScore += 1;

      // Design Preference Score
      const designPreferenceScore = scores.get(`designPreference.${userProfile.designPreference}`) || 0;
      if (designPreferenceScore > 0.7) {
        reasons.push(`Matches your ${userProfile.designPreference} design preference`);
        matchCount++;
      }
      totalScore += designPreferenceScore;
      maxPossibleScore += 1;

      // Color Preference Score
      const colorPreferenceScore = scores.get(`colorPreference.${userProfile.colorPreference}`) || 0;
      if (colorPreferenceScore > 0.7) {
        reasons.push(`Aligns with your ${userProfile.colorPreference} color choice`);
        matchCount++;
      }
      totalScore += colorPreferenceScore;
      maxPossibleScore += 1;

      // Target Audience Score
      const targetAudienceScore = scores.get(`targetAudience.${userProfile.targetAudience}`) || 0;
      if (targetAudienceScore > 0.7) {
        reasons.push(`Designed for ${userProfile.targetAudience}`);
        matchCount++;
      }
      totalScore += targetAudienceScore;
      maxPossibleScore += 1;

      // Invoice Frequency Score
      const invoiceFrequencyScore = scores.get(`invoiceFrequency.${userProfile.invoiceFrequency}`) || 0;
      if (invoiceFrequencyScore > 0.7) {
        reasons.push(`Optimized for ${userProfile.invoiceFrequency} invoicing`);
        matchCount++;
      }
      totalScore += invoiceFrequencyScore;
      maxPossibleScore += 1;

      // Budget Score
      const budgetScore = scores.get(`budget.${userProfile.budget}`) || 0;
      if (budgetScore > 0.7) {
        reasons.push(`Fits your ${userProfile.budget} budget`);
        matchCount++;
      }
      totalScore += budgetScore;
      maxPossibleScore += 1;

      // Experience Score
      const experienceScore = scores.get(`experience.${userProfile.experience}`) || 0;
      if (experienceScore > 0.7) {
        reasons.push(`Perfect for ${userProfile.experience} users`);
        matchCount++;
      }
      totalScore += experienceScore;
      maxPossibleScore += 1;

      // Goals Score
      userProfile.goals.forEach(goal => {
        const goalScore = scores.get(`goals.${goal}`) || 0;
        if (goalScore > 0.7) {
          reasons.push(`Helps achieve: ${this.formatGoal(goal)}`);
          matchCount++;
        }
        totalScore += goalScore;
        maxPossibleScore += 1;
      });

      const finalScore = totalScore / maxPossibleScore;
      const confidence = Math.min(matchCount / 10, 1); // Confidence based on matches

      let matchType: 'perfect' | 'excellent' | 'good' | 'decent';
      if (finalScore >= 0.9) matchType = 'perfect';
      else if (finalScore >= 0.8) matchType = 'excellent';
      else if (finalScore >= 0.7) matchType = 'good';
      else matchType = 'decent';

      recommendations.push({
        templateId,
        score: finalScore,
        reasons: reasons.slice(0, 3), // Top 3 reasons
        confidence,
        category: this.getTemplateCategory(templateId),
        matchType
      });
    });

    // Sort by score (highest first)
    return recommendations.sort((a, b) => b.score - a.score);
  }

  private formatGoal(goal: string): string {
    const goalMap: Record<string, string> = {
      'increase-conversions': 'Increase conversions',
      'build-trust': 'Build trust with clients',
      'save-time': 'Save time on invoicing',
      'look-professional': 'Look more professional',
      'stand-out': 'Stand out from competition',
      'scale-business': 'Scale your business'
    };
    return goalMap[goal] || goal;
  }

  private getTemplateCategory(templateId: string): string {
    const categoryMap: Record<string, string> = {
      'modern-professional': 'Professional',
      'minimal-clean': 'Minimal',
      'creative-bold': 'Creative'
    };
    return categoryMap[templateId] || 'Professional';
  }

  // Get personalized template suggestions based on partial profile
  getPersonalizedSuggestions(partialProfile: Partial<UserProfile>): string[] {
    const suggestions: string[] = [];
    
    if (partialProfile.businessType === 'freelancer') {
      suggestions.push('minimal-clean', 'modern-professional');
    } else if (partialProfile.businessType === 'agency') {
      suggestions.push('creative-bold', 'modern-professional');
    } else if (partialProfile.businessType === 'consultant') {
      suggestions.push('modern-professional', 'minimal-clean');
    }

    if (partialProfile.industry === 'marketing') {
      suggestions.push('creative-bold', 'modern-professional');
    } else if (partialProfile.industry === 'finance') {
      suggestions.push('modern-professional', 'minimal-clean');
    } else if (partialProfile.industry === 'design') {
      suggestions.push('creative-bold', 'minimal-clean');
    }

    return Array.from(new Set(suggestions)); // Remove duplicates
  }

  // Get onboarding questions based on current profile completion
  getOnboardingQuestions(completedProfile: Partial<UserProfile>): OnboardingQuestion[] {
    const questions: OnboardingQuestion[] = [];
    
    if (!completedProfile.businessType) {
      questions.push({
        id: 'businessType',
        type: 'choice',
        question: 'What type of business are you?',
        options: [
          { value: 'freelancer', label: 'Freelancer', icon: '👨‍💻' },
          { value: 'consultant', label: 'Consultant', icon: '💼' },
          { value: 'agency', label: 'Agency', icon: '🏢' },
          { value: 'startup', label: 'Startup', icon: '🚀' },
          { value: 'enterprise', label: 'Enterprise', icon: '🏭' },
          { value: 'nonprofit', label: 'Nonprofit', icon: '🤝' }
        ],
        required: true
      });
    }

    if (!completedProfile.industry) {
      questions.push({
        id: 'industry',
        type: 'choice',
        question: 'What industry are you in?',
        options: [
          { value: 'technology', label: 'Technology', icon: '💻' },
          { value: 'marketing', label: 'Marketing', icon: '📢' },
          { value: 'design', label: 'Design', icon: '🎨' },
          { value: 'consulting', label: 'Consulting', icon: '📊' },
          { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
          { value: 'legal', label: 'Legal', icon: '⚖️' },
          { value: 'finance', label: 'Finance', icon: '💰' },
          { value: 'education', label: 'Education', icon: '📚' },
          { value: 'real-estate', label: 'Real Estate', icon: '🏠' },
          { value: 'retail', label: 'Retail', icon: '🛍️' },
          { value: 'manufacturing', label: 'Manufacturing', icon: '🏭' },
          { value: 'other', label: 'Other', icon: '🔧' }
        ],
        required: true
      });
    }

    if (!completedProfile.designPreference) {
      questions.push({
        id: 'designPreference',
        type: 'choice',
        question: 'What design style do you prefer?',
        options: [
          { value: 'modern', label: 'Modern & Clean', icon: '✨' },
          { value: 'classic', label: 'Classic & Traditional', icon: '📜' },
          { value: 'minimal', label: 'Minimal & Simple', icon: '⚪' },
          { value: 'creative', label: 'Creative & Bold', icon: '🎭' },
          { value: 'professional', label: 'Professional & Trustworthy', icon: '🤝' },
          { value: 'bold', label: 'Bold & Eye-catching', icon: '🔥' }
        ],
        required: true
      });
    }

    if (!completedProfile.goals || completedProfile.goals.length === 0) {
      questions.push({
        id: 'goals',
        type: 'multiChoice',
        question: 'What are your main goals with invoicing?',
        options: [
          { value: 'look-professional', label: 'Look more professional', icon: '👔' },
          { value: 'build-trust', label: 'Build trust with clients', icon: '🤝' },
          { value: 'save-time', label: 'Save time on invoicing', icon: '⏰' },
          { value: 'stand-out', label: 'Stand out from competition', icon: '⭐' },
          { value: 'increase-conversions', label: 'Increase conversions', icon: '📈' },
          { value: 'scale-business', label: 'Scale your business', icon: '🚀' }
        ],
        required: true,
        maxSelections: 3
      });
    }

    return questions;
  }
}

export interface OnboardingQuestion {
  id: string;
  type: 'choice' | 'multiChoice' | 'text' | 'number';
  question: string;
  options?: { value: string; label: string; icon: string }[];
  required: boolean;
  maxSelections?: number;
  placeholder?: string;
}

// Predefined user profiles for quick start
export const QUICK_START_PROFILES: Record<string, Partial<UserProfile>> = {
  'freelancer-designer': {
    businessType: 'freelancer',
    industry: 'design',
    companySize: 'solo',
    designPreference: 'creative',
    colorPreference: 'branded',
    goals: ['stand-out', 'look-professional']
  },
  'marketing-agency': {
    businessType: 'agency',
    industry: 'marketing',
    companySize: '6-20',
    designPreference: 'bold',
    colorPreference: 'purple',
    goals: ['increase-conversions', 'scale-business']
  },
  'tech-consultant': {
    businessType: 'consultant',
    industry: 'technology',
    companySize: '2-5',
    designPreference: 'modern',
    colorPreference: 'blue',
    goals: ['build-trust', 'look-professional']
  },
  'healthcare-provider': {
    businessType: 'enterprise',
    industry: 'healthcare',
    companySize: '50+',
    designPreference: 'professional',
    colorPreference: 'neutral',
    goals: ['build-trust', 'look-professional']
  }
};
