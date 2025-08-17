#!/usr/bin/env node

/**
 * Production Deployment Script
 * Helps prepare and deploy InvoiceZap to production
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 InvoiceZap Production Deployment Script\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('📝 Please create .env.local with your production environment variables.');
  console.log('💡 You can copy from env.production.example as a starting point.\n');
  process.exit(1);
}

// Check required environment variables
const envContent = fs.readFileSync(envPath, 'utf8');
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY'
];

// Check for email provider (Resend)
const hasResend = /^RESEND_API_KEY=/m.test(envContent);

if (!hasResend) {
  console.log('⚠️  Warning: No email provider configured');
  console.log('   - Add RESEND_API_KEY for Resend');
  console.log('   - Emails will be logged to console only\n');
}

const missingVars = requiredVars.filter(varName => {
  const regex = new RegExp(`^${varName}=`, 'm');
  return !regex.test(envContent);
});

if (missingVars.length > 0) {
  console.log('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.log(`   - ${varName}`));
  console.log('\n📝 Please add these to your .env.local file.\n');
  process.exit(1);
}

console.log('✅ Environment variables check passed!');

// Check if build works
console.log('\n🔨 Testing production build...');
try {
  const { execSync } = require('child_process');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Production build successful!');
} catch (error) {
  console.log('❌ Production build failed!');
  console.log('🔧 Please fix the build errors before deploying.\n');
  process.exit(1);
}

// Deployment options
console.log('\n🌐 Deployment Options:');
console.log('1. Vercel (Recommended)');
console.log('   - Easy deployment with automatic builds');
console.log('   - Free tier available');
console.log('   - Command: npx vercel --prod');
console.log('');
console.log('2. Netlify');
console.log('   - Good free tier');
console.log('   - Command: npx netlify deploy --prod');
console.log('');
console.log('3. Self-hosted');
console.log('   - Full control over server');
console.log('   - Requires VPS setup');
console.log('');

console.log('📋 Pre-deployment Checklist:');
console.log('✅ Environment variables configured');
console.log('✅ Production build successful');
console.log('✅ Supabase database set up');
console.log('✅ Stripe account configured');
console.log('✅ Email provider configured (Resend)');
console.log('✅ Domain name purchased (optional)');
console.log('');

console.log('🎯 Next Steps:');
console.log('1. Choose your deployment platform');
console.log('2. Set up your domain (optional)');
console.log('3. Configure SSL certificate');
console.log('4. Set up monitoring and analytics');
console.log('5. Test all payment flows');
console.log('6. Launch your marketing campaign!');
console.log('');

console.log('🚀 Ready to deploy! Good luck with your launch!');
