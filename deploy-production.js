#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 InvoiceZap Production Deployment Script');
console.log('==========================================\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('Please create .env.local with your production environment variables.');
  console.log('See WEBHOOK_SETUP_GUIDE.md for required variables.\n');
  process.exit(1);
}

// Check required environment variables
const envContent = fs.readFileSync(envPath, 'utf8');
const requiredVars = [
  'STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_APP_URL'
];

const missingVars = requiredVars.filter(varName => {
  return !envContent.includes(`${varName}=`);
});

if (missingVars.length > 0) {
  console.log('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.log(`   - ${varName}`));
  console.log('\nPlease add these to your .env.local file.');
  process.exit(1);
}

console.log('✅ Environment variables check passed\n');

// Build the application
console.log('🔨 Building application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully\n');
} catch (error) {
  console.log('❌ Build failed!');
  process.exit(1);
}

// Deploy to Vercel
console.log('🚀 Deploying to Vercel...');
try {
  execSync('vercel --prod', { stdio: 'inherit' });
  console.log('✅ Deployment completed successfully!\n');
} catch (error) {
  console.log('❌ Deployment failed!');
  console.log('Make sure you have Vercel CLI installed: npm i -g vercel');
  process.exit(1);
}

console.log('🎉 InvoiceZap is now live!');
console.log('\n📋 Next Steps:');
console.log('1. Configure Stripe webhook endpoint with your production URL');
console.log('2. Test the webhook using Stripe Dashboard');
console.log('3. Set up monitoring and alerts');
console.log('4. Test the complete payment flow');
console.log('\n📖 See WEBHOOK_SETUP_GUIDE.md for detailed instructions.');
