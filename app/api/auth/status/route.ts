import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, isAuthError } from '@/lib/auth-middleware'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request)
    if (isAuthError(authResult)) {
      return NextResponse.json(
        { authenticated: false, error: authResult.error },
        { status: authResult.status }
      )
    }

    return NextResponse.json({
      authenticated: true,
      user: authResult.user
    })
  } catch (error) {
    console.error('Auth status error:', error)
    return NextResponse.json(
      { authenticated: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
