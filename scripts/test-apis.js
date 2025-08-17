#!/usr/bin/env node

console.log('🧪 InvoiceZap API Testing Suite\n')

const BASE_URL = 'http://localhost:3000/api'

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
  company: 'Test Company',
  plan: 'free'
}

const testClient = {
  name: 'Test Client',
  email: 'client@test.com',
  phone: '+1-555-0123',
  address: '123 Test St, Test City, TC 12345',
  userId: 'user_test_123'
}

const testInvoice = {
  clientId: 'client_test_123',
  userId: 'user_test_123',
  items: [
    {
      description: 'Test Service',
      quantity: 1,
      unitPrice: 100.00,
      amount: 100.00
    }
  ],
  dueDate: '2024-02-15',
  notes: 'Test invoice'
}

const testTemplate = {
  name: 'Test Template',
  userId: 'user_test_123',
  category: 'test',
  config: {
    colors: { primary: '#3B82F6', secondary: '#1F2937' },
    layout: 'modern'
  }
}

const testUserProfile = {
  industry: 'technology',
  businessSize: 'startup',
  invoiceFrequency: 'monthly',
  designPreference: 'modern',
  colorScheme: 'professional'
}

// Test functions
async function testAPI(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    
    if (data) {
      options.body = JSON.stringify(data)
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options)
    const result = await response.json()
    
    if (response.ok) {
      console.log(`✅ ${method} ${endpoint} - Success`)
      return result
    } else {
      console.log(`❌ ${method} ${endpoint} - Error: ${result.error}`)
      return null
    }
  } catch (error) {
    console.log(`❌ ${method} ${endpoint} - Network Error: ${error.message}`)
    return null
  }
}

async function runTests() {
  console.log('🚀 Starting API tests...\n')
  
  // Test Authentication APIs
  console.log('🔐 Testing Authentication APIs...')
  await testAPI('/auth/register', 'POST', testUser)
  await testAPI('/auth/login', 'POST', { email: testUser.email, password: testUser.password })
  await testAPI('/auth/logout', 'POST')
  
  // Test Client Management APIs
  console.log('\n👥 Testing Client Management APIs...')
  await testAPI('/clients', 'POST', testClient)
  await testAPI('/clients?userId=user_test_123')
  await testAPI('/clients/client_test_123')
  await testAPI('/clients/client_test_123', 'PUT', { name: 'Updated Test Client' })
  
  // Test Invoice Management APIs
  console.log('\n📄 Testing Invoice Management APIs...')
  await testAPI('/invoices', 'POST', testInvoice)
  await testAPI('/invoices?userId=user_test_123')
  await testAPI('/invoices/inv_test_123')
  
  // Test Template Management APIs
  console.log('\n🎨 Testing Template Management APIs...')
  await testAPI('/templates', 'POST', testTemplate)
  await testAPI('/templates?userId=user_test_123')
  await testAPI('/templates/template_test_123')
  await testAPI('/templates/duplicate', 'POST', {
    templateId: 'template_test_123',
    userId: 'user_test_123',
    newName: 'Duplicated Test Template'
  })
  
  // Test Template Recommendations APIs
  console.log('\n🎯 Testing Template Recommendations APIs...')
  await testAPI('/recommendations', 'POST', { userProfile: testUserProfile, limit: 3 })
  await testAPI('/recommendations/quick-start')
  
  // Test User Profile APIs
  console.log('\n👤 Testing User Profile APIs...')
  await testAPI('/user/profile?userId=user_test_123')
  await testAPI('/user/profile', 'PUT', {
    userId: 'user_test_123',
    name: 'Updated Test User'
  })
  
  // Test Analytics APIs
  console.log('\n📊 Testing Analytics APIs...')
  await testAPI('/analytics/dashboard?userId=user_test_123')
  await testAPI('/analytics/reports', 'POST', {
    userId: 'user_test_123',
    reportType: 'revenue',
    filters: { startDate: '2024-01-01', endDate: '2024-01-31' }
  })
  
  // Test Stripe APIs (these will fail without real keys, but that's expected)
  console.log('\n💳 Testing Stripe APIs...')
  await testAPI('/stripe/create-checkout-session', 'POST', {
    priceId: 'price_test',
    successUrl: 'http://localhost:3000/success',
    cancelUrl: 'http://localhost:3000/cancel'
  })
  
  // Test Email APIs
  console.log('\n📧 Testing Email APIs...')
  await testAPI('/email/send-email', 'POST', {
    to: 'test@example.com',
    subject: 'Test Email',
    content: 'This is a test email'
  })
  
  console.log('\n🎉 API testing completed!')
  console.log('\n📝 Note: Some endpoints may show errors due to missing data or mock implementations.')
  console.log('   This is expected behavior for the mock system.')
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/test`)
    if (response.ok) {
      console.log('✅ Server is running at http://localhost:3000')
      runTests()
    }
  } catch (error) {
    console.log('❌ Server is not running. Please start the development server first:')
    console.log('   npm run dev')
    console.log('\n   Or use the quick start scripts:')
    console.log('   start.bat (Windows) or start.ps1 (PowerShell)')
  }
}

checkServer()
