import { NextRequest, NextResponse } from 'next/server'
import { dataService } from '@/lib/dataService'
import { authenticateRequest, isAuthError } from '@/lib/auth-middleware'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET /api/analytics/dashboard - Get dashboard analytics
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request)
    if (isAuthError(authResult)) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days

    // Get analytics data
    const analytics = await dataService.getDashboardAnalytics(authResult.user.id, parseInt(period))
    
    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Get dashboard analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
