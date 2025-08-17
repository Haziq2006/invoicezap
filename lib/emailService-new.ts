// Modern, Multi-Provider Email Service
// Supports: Resend (recommended), SendGrid, Console logging

export interface EmailData {
  to: string
  subject: string
  content: string
  from?: string
  html?: string
}

export interface InvoiceEmailData {
  invoiceId: string
  clientEmail: string
  clientName: string
  amount: number
  dueDate: string
  invoiceUrl?: string
  pdfAttachment?: Blob
}

export class EmailService {
  private fromEmail: string = process.env.EMAIL_FROM || 'noreply@invoicezap.com'
  private fromName: string = 'InvoiceZap'
  private provider: 'resend' | 'sendgrid' | 'console' = 'console'

  constructor() {
    // Auto-detect which email provider is configured
    if (process.env.RESEND_API_KEY) {
      this.provider = 'resend'
    } else if (process.env.SENDGRID_API_KEY) {
      this.provider = 'sendgrid'
      const sgMail = require('@sendgrid/mail')
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    } else {
      this.provider = 'console'
      console.log('📧 No email provider configured - using console logging')
    }
  }

  async sendEmail(emailData: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      switch (this.provider) {
        case 'resend':
          return await this.sendWithResend(emailData)
        case 'sendgrid':
          return await this.sendWithSendGrid(emailData)
        case 'console':
        default:
          return await this.sendWithConsole(emailData)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async sendWithResend(emailData: EmailData) {
    try {
      // Dynamic import to avoid errors if Resend not installed
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY!)

      const response = await resend.emails.send({
        from: `${this.fromName} <${emailData.from || this.fromEmail}>`,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html || emailData.content,
        text: emailData.content
      })

      return {
        success: true,
        messageId: response.data?.id || `resend_${Date.now()}`
      }
    } catch (error) {
      throw new Error(`Resend error: ${error}`)
    }
  }

  private async sendWithSendGrid(emailData: EmailData) {
    try {
      const sgMail = require('@sendgrid/mail')
      
      const msg = {
        to: emailData.to,
        from: {
          email: emailData.from || this.fromEmail,
          name: this.fromName
        },
        subject: emailData.subject,
        text: emailData.content,
        html: emailData.html || emailData.content
      }

      const response = await sgMail.send(msg)
      
      return {
        success: true,
        messageId: response[0]?.headers['x-message-id'] || `sendgrid_${Date.now()}`
      }
    } catch (error) {
      throw new Error(`SendGrid error: ${error}`)
    }
  }

  private async sendWithConsole(emailData: EmailData) {
    console.log('\n📧 ===== EMAIL SENT =====')
    console.log(`To: ${emailData.to}`)
    console.log(`From: ${emailData.from || this.fromEmail}`)
    console.log(`Subject: ${emailData.subject}`)
    console.log(`Content: ${emailData.content}`)
    if (emailData.html) {
      console.log(`HTML: ${emailData.html.substring(0, 100)}...`)
    }
    console.log('📧 =====================\n')
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      success: true,
      messageId: `console_${Date.now()}`
    }
  }

  async sendInvoiceEmail(invoiceData: InvoiceEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const subject = `Invoice #${invoiceData.invoiceId} from InvoiceZap`
    const htmlContent = this.generateInvoiceEmailHTML(invoiceData)
    const textContent = this.generateInvoiceEmailText(invoiceData)
    
    return await this.sendEmail({
      to: invoiceData.clientEmail,
      subject,
      content: textContent,
      html: htmlContent
    })
  }

  async sendPaymentReminder(invoiceData: InvoiceEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const subject = `Payment Reminder: Invoice #${invoiceData.invoiceId}`
    const htmlContent = this.generatePaymentReminderHTML(invoiceData)
    const textContent = this.generatePaymentReminderText(invoiceData)
    
    return await this.sendEmail({
      to: invoiceData.clientEmail,
      subject,
      content: textContent,
      html: htmlContent
    })
  }

  async sendOverdueNotification(invoiceData: InvoiceEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const subject = `URGENT: Overdue Invoice #${invoiceData.invoiceId}`
    const htmlContent = this.generateOverdueNotificationHTML(invoiceData)
    const textContent = this.generateOverdueNotificationText(invoiceData)
    
    return await this.sendEmail({
      to: invoiceData.clientEmail,
      subject,
      content: textContent,
      html: htmlContent
    })
  }

  private generateInvoiceEmailHTML(data: InvoiceEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice #${data.invoiceId}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; text-align: center;">InvoiceZap</h1>
            <p style="color: white; text-align: center; margin: 10px 0 0 0;">Professional Invoicing Made Simple</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #2d3748; margin-top: 0;">Invoice #${data.invoiceId}</h2>
            <p><strong>Amount Due:</strong> $${data.amount.toFixed(2)}</p>
            <p><strong>Due Date:</strong> ${data.dueDate}</p>
          </div>
          
          <div style="background: white; padding: 25px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <p>Dear ${data.clientName},</p>
            <p>Please find attached your invoice for services rendered. The total amount due is <strong>$${data.amount.toFixed(2)}</strong>.</p>
            <p>Payment is due by <strong>${data.dueDate}</strong>. You can pay securely online using the payment link below.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.invoiceUrl || '#'}" style="background: #4299e1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Pay Now</a>
            </div>
            
            <p>If you have any questions about this invoice, please don't hesitate to contact us.</p>
            
            <p>Thank you for your business!</p>
            <p>Best regards,<br>The InvoiceZap Team</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #718096; font-size: 14px;">
            <p>This email was sent by InvoiceZap - Professional Invoicing Made Simple</p>
          </div>
        </body>
      </html>
    `
  }

  private generateInvoiceEmailText(data: InvoiceEmailData): string {
    return `
InvoiceZap - Professional Invoicing Made Simple

Invoice #${data.invoiceId}

Dear ${data.clientName},

Please find attached your invoice for services rendered. The total amount due is $${data.amount.toFixed(2)}.

Payment is due by ${data.dueDate}. You can pay securely online using the payment link: ${data.invoiceUrl || 'Payment link will be provided'}

If you have any questions about this invoice, please don't hesitate to contact us.

Thank you for your business!

Best regards,
The InvoiceZap Team

---
This email was sent by InvoiceZap - Professional Invoicing Made Simple
    `.trim()
  }

  private generatePaymentReminderHTML(data: InvoiceEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Reminder - Invoice #${data.invoiceId}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; text-align: center;">Payment Reminder</h1>
            <p style="color: white; text-align: center; margin: 10px 0 0 0;">InvoiceZap</p>
          </div>
          
          <div style="background: #fff5f5; padding: 25px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #f56565;">
            <h2 style="color: #c53030; margin-top: 0;">Payment Reminder</h2>
            <p><strong>Invoice #${data.invoiceId}</strong> is due for payment.</p>
            <p><strong>Amount Due:</strong> $${data.amount.toFixed(2)}</p>
            <p><strong>Due Date:</strong> ${data.dueDate}</p>
          </div>
          
          <div style="background: white; padding: 25px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <p>Dear ${data.clientName},</p>
            <p>This is a friendly reminder that your invoice #${data.invoiceId} for <strong>$${data.amount.toFixed(2)}</strong> is due for payment.</p>
            <p>To avoid any late fees, please process your payment as soon as possible.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.invoiceUrl || '#'}" style="background: #f56565; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Pay Now</a>
            </div>
            
            <p>If you have already made the payment, please disregard this reminder.</p>
            
            <p>Thank you for your prompt attention to this matter.</p>
            
            <p>Best regards,<br>The InvoiceZap Team</p>
          </div>
        </body>
      </html>
    `
  }

  private generatePaymentReminderText(data: InvoiceEmailData): string {
    return `
Payment Reminder - InvoiceZap

Payment Reminder

Invoice #${data.invoiceId} is due for payment.

Amount Due: $${data.amount.toFixed(2)}
Due Date: ${data.dueDate}

Dear ${data.clientName},

This is a friendly reminder that your invoice #${data.invoiceId} for $${data.amount.toFixed(2)} is due for payment.

To avoid any late fees, please process your payment as soon as possible.

Payment Link: ${data.invoiceUrl || 'Payment link will be provided'}

If you have already made the payment, please disregard this reminder.

Thank you for your prompt attention to this matter.

Best regards,
The InvoiceZap Team
    `.trim()
  }

  private generateOverdueNotificationHTML(data: InvoiceEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>URGENT: Overdue Invoice #${data.invoiceId}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; text-align: center;">URGENT: Overdue Invoice</h1>
            <p style="color: white; text-align: center; margin: 10px 0 0 0;">InvoiceZap</p>
          </div>
          
          <div style="background: #fed7d7; padding: 25px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #e53e3e;">
            <h2 style="color: #c53030; margin-top: 0;">⚠️ OVERDUE INVOICE</h2>
            <p><strong>Invoice #${data.invoiceId}</strong> is now overdue.</p>
            <p><strong>Amount Due:</strong> $${data.amount.toFixed(2)}</p>
            <p><strong>Due Date:</strong> ${data.dueDate}</p>
            <p style="color: #c53030; font-weight: bold;">Late fees may apply.</p>
          </div>
          
          <div style="background: white; padding: 25px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <p>Dear ${data.clientName},</p>
            <p>Your invoice #${data.invoiceId} for <strong>$${data.amount.toFixed(2)}</strong> is now overdue.</p>
            <p style="color: #c53030; font-weight: bold;">Immediate payment is required to avoid additional late fees and potential service suspension.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.invoiceUrl || '#'}" style="background: #e53e3e; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">PAY NOW - URGENT</a>
            </div>
            
            <p>If you are experiencing financial difficulties, please contact us immediately to discuss payment arrangements.</p>
            
            <p>We value our business relationship and want to resolve this matter promptly.</p>
            
            <p>Best regards,<br>The InvoiceZap Team</p>
          </div>
        </body>
      </html>
    `
  }

  private generateOverdueNotificationText(data: InvoiceEmailData): string {
    return `
URGENT: Overdue Invoice - InvoiceZap

⚠️ OVERDUE INVOICE

Invoice #${data.invoiceId} is now overdue.

Amount Due: $${data.amount.toFixed(2)}
Due Date: ${data.dueDate}
Late fees may apply.

Dear ${data.clientName},

Your invoice #${data.invoiceId} for $${data.amount.toFixed(2)} is now overdue.

IMMEDIATE PAYMENT IS REQUIRED to avoid additional late fees and potential service suspension.

Payment Link: ${data.invoiceUrl || 'Payment link will be provided'}

If you are experiencing financial difficulties, please contact us immediately to discuss payment arrangements.

We value our business relationship and want to resolve this matter promptly.

Best regards,
The InvoiceZap Team
    `.trim()
  }
}

// Export singleton instance
export const emailService = new EmailService()

