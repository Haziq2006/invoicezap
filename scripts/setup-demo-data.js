#!/usr/bin/env node

/**
 * Setup Demo Data Script
 * Creates sample data in localStorage for testing the dashboard
 */

console.log('🚀 Setting up demo data for InvoiceZap...\n')

// Demo user data
const demoUser = {
  id: 'demo_user_123',
  email: 'demo@invoicezap.com',
  name: 'Demo User',
  plan: 'pro'
}

// Demo profile data
const demoProfile = {
  id: 'demo_user_123',
  first_name: 'Demo',
  last_name: 'User',
  plan: 'pro',
  company: 'Demo Company Ltd',
  address: '123 Demo Street, London, UK',
  phone: '+44 20 1234 5678',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

// Demo clients
const demoClients = [
  {
    id: 'client_1',
    name: 'Acme Corporation',
    email: 'john@acmecorp.com',
    address: '456 Business Ave, Manchester, UK',
    phone: '+44 161 123 4567',
    company: 'Acme Corporation',
    notes: 'Regular client - monthly retainer',
    created_at: new Date().toISOString()
  },
  {
    id: 'client_2',
    name: 'TechStart Inc',
    email: 'sarah@techstart.com',
    address: '789 Innovation St, Birmingham, UK',
    phone: '+44 121 987 6543',
    company: 'TechStart Inc',
    notes: 'Startup client - project-based work',
    created_at: new Date().toISOString()
  },
  {
    id: 'client_3',
    name: 'Design Studio',
    email: 'mike@designstudio.com',
    address: '321 Creative Lane, Bristol, UK',
    phone: '+44 117 456 7890',
    company: 'Design Studio',
    notes: 'Creative agency - ongoing partnership',
    created_at: new Date().toISOString()
  }
]

// Demo invoices
const demoInvoices = [
  {
    id: 'inv_1',
    invoiceNumber: 'INV-202401-001',
    clientId: 'client_1',
    clientName: 'Acme Corporation',
    clientEmail: 'john@acmecorp.com',
    amount: 1200,
    status: 'paid',
    issueDate: '2024-01-01',
    dueDate: '2024-01-15',
    paidDate: '2024-01-12',
    template: 'pro',
    notes: 'Website redesign project',
    paymentLink: 'https://checkout.stripe.com/pay/cs_test_123',
    hasPaymentLink: true,
    lineItems: [
      { description: 'Website Design', quantity: 1, rate: 800, amount: 800 },
      { description: 'Development', quantity: 1, rate: 400, amount: 400 }
    ],
    subtotal: 1200,
    taxRate: 20,
    taxAmount: 240,
    total: 1440
  },
  {
    id: 'inv_2',
    invoiceNumber: 'INV-202401-002',
    clientId: 'client_2',
    clientName: 'TechStart Inc',
    clientEmail: 'sarah@techstart.com',
    amount: 850,
    status: 'pending',
    issueDate: '2024-01-05',
    dueDate: '2024-01-20',
    template: 'basic',
    notes: 'Logo design and branding',
    hasPaymentLink: false,
    lineItems: [
      { description: 'Logo Design', quantity: 1, rate: 500, amount: 500 },
      { description: 'Brand Guidelines', quantity: 1, rate: 350, amount: 350 }
    ],
    subtotal: 850,
    taxRate: 20,
    taxAmount: 170,
    total: 1020
  },
  {
    id: 'inv_3',
    invoiceNumber: 'INV-202401-003',
    clientId: 'client_3',
    clientName: 'Design Studio',
    clientEmail: 'mike@designstudio.com',
    amount: 2100,
    status: 'overdue',
    issueDate: '2023-12-20',
    dueDate: '2024-01-10',
    template: 'etsy',
    notes: 'Full website development',
    hasPaymentLink: false,
    lineItems: [
      { description: 'Website Development', quantity: 1, rate: 1500, amount: 1500 },
      { description: 'Content Creation', quantity: 1, rate: 600, amount: 600 }
    ],
    subtotal: 2100,
    taxRate: 20,
    taxAmount: 420,
    total: 2520
  }
]

// Demo templates
const demoTemplates = [
  {
    id: 'template_1',
    name: 'Freelancer Basic',
    description: 'Clean and simple design for freelancers',
    category: 'freelancer',
    isCustom: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'template_2',
    name: 'Consultant Pro',
    description: 'Professional template for consultants',
    category: 'consultant',
    isCustom: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'template_3',
    name: 'Etsy Seller',
    description: 'Perfect for creative businesses',
    category: 'creative',
    isCustom: false,
    created_at: new Date().toISOString()
  }
]

// Function to save data to localStorage
function saveDemoData() {
  try {
    // Save user data
    localStorage.setItem('invoicezap_user', JSON.stringify(demoUser))
    localStorage.setItem('invoicezap_profile', JSON.stringify(demoProfile))
    
    // Save clients
    localStorage.setItem('invoicezap_clients', JSON.stringify(demoClients))
    
    // Save invoices
    localStorage.setItem('invoicezap_invoices', JSON.stringify(demoInvoices))
    
    // Save templates
    localStorage.setItem('invoicezap_templates', JSON.stringify(demoTemplates))
    
    console.log('✅ Demo data saved successfully!')
    console.log('📊 Data summary:')
    console.log(`   👤 User: ${demoUser.name} (${demoUser.plan} plan)`)
    console.log(`   🏢 Clients: ${demoClients.length}`)
    console.log(`   📄 Invoices: ${demoInvoices.length}`)
    console.log(`   🎨 Templates: ${demoTemplates.length}`)
    
    console.log('\n🚀 You can now:')
    console.log('   1. Go to /login and click "Enter Demo Dashboard"')
    console.log('   2. Explore the dashboard with sample data')
    console.log('   3. Test invoice creation and management')
    console.log('   4. Try the status management system')
    
  } catch (error) {
    console.error('❌ Error saving demo data:', error)
  }
}

// Function to clear demo data
function clearDemoData() {
  try {
    localStorage.removeItem('invoicezap_user')
    localStorage.removeItem('invoicezap_profile')
    localStorage.removeItem('invoicezap_clients')
    localStorage.removeItem('invoicezap_invoices')
    localStorage.removeItem('invoicezap_templates')
    
    console.log('🗑️  Demo data cleared successfully!')
  } catch (error) {
    console.error('❌ Error clearing demo data:', error)
  }
}

// Check command line arguments
const args = process.argv.slice(2)

if (args.includes('--clear')) {
  clearDemoData()
} else {
  saveDemoData()
}

console.log('\n💡 Tip: Run with --clear to remove demo data')
console.log('   Example: node scripts/setup-demo-data.js --clear')
