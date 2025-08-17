import { NextRequest, NextResponse } from 'next/server'
import { EmailService } from '@/lib/emailService'

export async function POST(request: NextRequest) {
  try {
    const { invoiceId, clientEmail, clientName, amount, dueDate } = await request.json()

    if (!invoiceId || !clientEmail || !clientName || !amount || !dueDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const emailService = new EmailService()
    
    const result = await emailService.sendInvoiceEmail({
      invoiceId,
      clientEmail,
      clientName,
      amount: parseFloat(amount),
      dueDate
    })

    if (result.success) {
      return NextResponse.json({
        message: 'Invoice email sent successfully',
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send invoice email' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Send invoice email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
