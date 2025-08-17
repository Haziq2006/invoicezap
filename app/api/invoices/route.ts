import { NextRequest, NextResponse } from 'next/server'
import { dataService } from '@/lib/dataService'
import { authenticateRequest, isAuthError } from '@/lib/auth-middleware'

// GET /api/invoices - Get all invoices for a user
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request)
    if (isAuthError(authResult)) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const invoices = await dataService.getInvoices(authResult.user.id)
    
    return NextResponse.json(invoices)
  } catch (error) {
    console.error('Get invoices error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/invoices - Create a new invoice
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request)
    if (isAuthError(authResult)) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const { items, ...invoiceData } = await request.json()
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invoice items are required' },
        { status: 400 }
      )
    }

    const invoice = await dataService.saveInvoice(invoiceData, items, authResult.user.id)
    
    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error('Create invoice error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
