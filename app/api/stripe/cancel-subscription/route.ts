import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { userId, subscriptionId } = await request.json()

    if (!userId || !subscriptionId) {
      return NextResponse.json(
        { error: 'User ID and subscription ID are required' },
        { status: 400 }
      )
    }

    // Cancel the subscription at period end
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    // Update user plan in database (mock for now)
    // TODO: Update user plan in Supabase when ready
    
    return NextResponse.json({
      message: 'Subscription cancelled successfully',
      subscriptionId: subscription.id,
      cancelAt: subscription.cancel_at
    })
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}
