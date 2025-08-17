// Test Email Service - Verify all providers work correctly

const { emailService } = require('../lib/emailService.ts')

async function testEmailService() {
  console.log('🧪 Testing Email Service...\n')

  // Test basic email sending
  console.log('📧 Testing basic email...')
  const basicResult = await emailService.sendEmail({
    to: 'test@example.com',
    subject: 'Test Email from InvoiceZap',
    content: 'This is a test email to verify the email service is working correctly.',
    html: '<h1>Test Email</h1><p>This is a test email to verify the email service is working correctly.</p>'
  })

  console.log('Basic Email Result:', basicResult)
  console.log('')

  // Test invoice email
  console.log('📄 Testing invoice email...')
  const invoiceResult = await emailService.sendInvoiceEmail({
    invoiceId: 'TEST-001',
    clientEmail: 'client@example.com',
    clientName: 'Test Client',
    amount: 150.00,
    dueDate: '2024-02-01',
    invoiceUrl: 'https://invoicezap.com/invoice/TEST-001'
  })

  console.log('Invoice Email Result:', invoiceResult)
  console.log('')

  // Test payment reminder
  console.log('⏰ Testing payment reminder...')
  const reminderResult = await emailService.sendPaymentReminder({
    invoiceId: 'TEST-002',
    clientEmail: 'client@example.com',
    clientName: 'Test Client',
    amount: 75.50,
    dueDate: '2024-01-15',
    invoiceUrl: 'https://invoicezap.com/invoice/TEST-002'
  })

  console.log('Payment Reminder Result:', reminderResult)
  console.log('')

  // Test overdue notification
  console.log('🚨 Testing overdue notification...')
  const overdueResult = await emailService.sendOverdueNotification({
    invoiceId: 'TEST-003',
    clientEmail: 'client@example.com',
    clientName: 'Test Client',
    amount: 200.00,
    dueDate: '2024-01-01',
    invoiceUrl: 'https://invoicezap.com/invoice/TEST-003'
  })

  console.log('Overdue Notification Result:', overdueResult)
  console.log('')

  console.log('✅ Email service test completed!')
  console.log('\n📝 Current Configuration:')
  console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Not set')

  console.log('- EMAIL_FROM:', process.env.EMAIL_FROM || 'Using default')
  
  if (!process.env.RESEND_API_KEY) {
    console.log('\n💡 No email provider configured - using console logging mode')
    console.log('   To send real emails, add RESEND_API_KEY to your .env.local')
  }
}

// Handle both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testEmailService }
}

// Run if called directly
if (require.main === module) {
  testEmailService().catch(console.error)
}
