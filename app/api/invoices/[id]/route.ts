import { NextRequest, NextResponse } from 'next/server'
import { dataService } from '@/lib/dataService'
import { authenticateRequest, isAuthError } from '@/lib/auth-middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateRequest(request)
    if (isAuthError(authResult)) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const invoice = await dataService.getInvoice(params.id, authResult.user.id)
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }
    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateRequest(request)
    if (isAuthError(authResult)) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const body = await request.json()
    const updatedInvoice = await dataService.updateInvoice(params.id, body, authResult.user.id)
    return NextResponse.json(updatedInvoice)
  } catch (error) {
    console.error('Error updating invoice:', error)
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateRequest(request)
    if (isAuthError(authResult)) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const body = await request.json()
    
    // Handle status updates specifically
    if (body.status) {
      const updateData: any = { status: body.status }
      
      // If marking as paid, add paid date
      if (body.status === 'paid' && body.paidDate) {
        updateData.paidDate = body.paidDate
      }
      
      // If changing from paid to something else, remove paid date
      if (body.status !== 'paid') {
        updateData.paidDate = null
      }
      
      const updatedInvoice = await dataService.updateInvoice(params.id, updateData, authResult.user.id)
      return NextResponse.json(updatedInvoice)
    }
    
    // Handle other partial updates
    const updatedInvoice = await dataService.updateInvoice(params.id, body, authResult.user.id)
    return NextResponse.json(updatedInvoice)
  } catch (error) {
    console.error('Error updating invoice status:', error)
    return NextResponse.json({ error: 'Failed to update invoice status' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateRequest(request)
    if (isAuthError(authResult)) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    await dataService.deleteInvoice(params.id, authResult.user.id)
    return NextResponse.json({ message: 'Invoice deleted successfully' })
  } catch (error) {
    console.error('Error deleting invoice:', error)
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 })
  }
}
