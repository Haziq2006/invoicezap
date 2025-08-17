import { NextRequest, NextResponse } from 'next/server'
import { dataService } from '@/lib/dataService'
import { authenticateRequest, isAuthError } from '@/lib/auth-middleware'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET /api/clients/[id] - Get client by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authenticateRequest(request)
    if (isAuthError(authResult)) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const client = await dataService.getClientById(params.id, authResult.user.id)
    
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(client)
  } catch (error) {
    console.error('Get client error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/clients/[id] - Update client
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authenticateRequest(request)
    if (isAuthError(authResult)) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const updates = await request.json()
    
    const updatedClient = await dataService.updateClient(params.id, updates, authResult.user.id)
    
    return NextResponse.json(updatedClient)
  } catch (error) {
    console.error('Update client error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/clients/[id] - Delete client
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authenticateRequest(request)
    if (isAuthError(authResult)) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const success = await dataService.deleteClient(params.id, authResult.user.id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Client deleted successfully' })
  } catch (error) {
    console.error('Delete client error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}