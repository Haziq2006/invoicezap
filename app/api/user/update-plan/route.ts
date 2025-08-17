import { NextRequest, NextResponse } from 'next/server'
import { dataService } from '@/lib/dataService'
import { authenticateRequest, isAuthError } from '@/lib/auth-middleware'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request)
    if (isAuthError(authResult)) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const { plan, stripeSubscriptionId, subscriptionStatus } = await request.json()

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan is required' },
        { status: 400 }
      )
    }

    // Update user plan in database
    const updateData: any = { plan }
    
    if (stripeSubscriptionId) {
      updateData.stripe_subscription_id = stripeSubscriptionId
    }
    
    if (subscriptionStatus) {
      updateData.subscription_status = subscriptionStatus
    }

    const updatedProfile = await dataService.updateUserProfile(authResult.user.id, updateData)

    if (!updatedProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'User plan updated successfully',
      user: updatedProfile
    })
  } catch (error) {
    console.error('Update user plan error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
