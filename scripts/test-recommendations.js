#!/usr/bin/env node

/**
 * 🧪 Template Recommendation System Test Script
 * 
 * This script demonstrates how the AI-powered template recommendation
 * algorithm works with different user profiles.
 */

console.log('🎯 InvoiceZap Template Recommendation System Test\n');

// Simulate the recommendation algorithm
const testProfiles = [
  {
    name: 'Freelancer Designer',
    profile: {
      businessType: 'freelancer',
      industry: 'design',
      companySize: 'solo',
      designPreference: 'creative',
      colorPreference: 'branded',
      goals: ['stand-out', 'look-professional']
    }
  },
  {
    name: 'Marketing Agency',
    profile: {
      businessType: 'agency',
      industry: 'marketing',
      companySize: '6-20',
      designPreference: 'bold',
      colorPreference: 'purple',
      goals: ['increase-conversions', 'scale-business']
    }
  },
  {
    name: 'Tech Consultant',
    profile: {
      businessType: 'consultant',
      industry: 'technology',
      companySize: '2-5',
      designPreference: 'modern',
      colorPreference: 'blue',
      goals: ['build-trust', 'look-professional']
    }
  },
  {
    name: 'Healthcare Provider',
    profile: {
      businessType: 'enterprise',
      industry: 'healthcare',
      companySize: '50+',
      designPreference: 'professional',
      colorPreference: 'neutral',
      goals: ['build-trust', 'look-professional']
    }
  }
];

// Template scoring logic (simplified version)
const calculateScore = (profile, template) => {
  let score = 0;
  let maxScore = 0;

  // Business type scoring
  if (template.businessTypes.includes(profile.businessType)) {
    score += 0.9;
  }
  maxScore += 1;

  // Industry scoring
  if (template.industries.includes(profile.industry)) {
    score += 0.9;
  }
  maxScore += 1;

  // Design preference scoring
  if (template.designPreferences.includes(profile.designPreference)) {
    score += 1.0;
  }
  maxScore += 1;

  // Goals scoring
  const goalMatches = profile.goals.filter(goal => 
    template.goals.includes(goal)
  ).length;
  score += (goalMatches / profile.goals.length) * 0.8;
  maxScore += 0.8;

  return score / maxScore;
};

// Available templates
const templates = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    businessTypes: ['consultant', 'enterprise', 'startup'],
    industries: ['technology', 'consulting', 'finance', 'legal'],
    designPreferences: ['modern', 'professional'],
    goals: ['build-trust', 'look-professional', 'scale-business'],
    category: 'Professional'
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    businessTypes: ['freelancer', 'startup'],
    industries: ['design', 'technology', 'education'],
    designPreferences: ['minimal', 'modern'],
    goals: ['save-time', 'look-professional'],
    category: 'Minimal'
  },
  {
    id: 'creative-bold',
    name: 'Creative Bold',
    businessTypes: ['agency', 'startup', 'freelancer'],
    industries: ['marketing', 'design', 'retail'],
    designPreferences: ['creative', 'bold'],
    goals: ['stand-out', 'increase-conversions', 'scale-business'],
    category: 'Creative'
  }
];

// Test each profile
testProfiles.forEach(({ name, profile }) => {
  console.log(`👤 Testing: ${name}`);
  console.log(`   Business: ${profile.businessType} | Industry: ${profile.industry}`);
  console.log(`   Style: ${profile.designPreference} | Goals: ${profile.goals.join(', ')}\n`);

  // Calculate scores for all templates
  const recommendations = templates.map(template => ({
    ...template,
    score: calculateScore(profile, template)
  }));

  // Sort by score (highest first)
  recommendations.sort((a, b) => b.score - a.score);

  // Display recommendations
  recommendations.forEach((rec, index) => {
    const percentage = Math.round(rec.score * 100);
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
    const matchType = percentage >= 90 ? 'Perfect Match' : 
                     percentage >= 80 ? 'Excellent Match' : 
                     percentage >= 70 ? 'Good Match' : 'Decent Match';
    
    console.log(`   ${medal} ${rec.name} (${rec.category})`);
    console.log(`      Score: ${percentage}% | ${matchType}`);
    
    // Show reasoning
    if (rec.businessTypes.includes(profile.businessType)) {
      console.log(`      ✓ Perfect for ${profile.businessType} businesses`);
    }
    if (rec.industries.includes(profile.industry)) {
      console.log(`      ✓ Ideal for ${profile.industry} industry`);
    }
    if (rec.designPreferences.includes(profile.designPreference)) {
      console.log(`      ✓ Matches your ${profile.designPreference} preference`);
    }
    
    console.log('');
  });

  console.log('─'.repeat(60) + '\n');
});

console.log('🎉 Test completed! This shows how the algorithm works.');
console.log('💡 In the real app, users get personalized recommendations');
console.log('🚀 Try it yourself at /onboarding after starting the app!\n');

// Show how to run the app
console.log('📱 To test the full system:');
console.log('   1. npm run dev');
console.log('   2. Go to http://localhost:3000/onboarding');
console.log('   3. Try different profiles and see live recommendations!\n');
