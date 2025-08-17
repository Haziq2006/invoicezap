import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const PLANS = {
  free: {
    name: 'Free Plan',
    price: 0,
    features: ['5 invoices/month', 'Basic templates', 'Email support']
  },
  pro: {
    name: 'Pro Plan',
    price: 29,
    features: ['Unlimited invoices', 'Premium templates', 'Priority support', 'Custom branding']
  },
  enterprise: {
    name: 'Enterprise Plan',
    price: 99,
    features: ['Everything in Pro', 'Team collaboration', 'Advanced analytics', 'API access', 'Dedicated support']
  }
};

export async function POST(request: NextRequest) {
  try {
    const { plan, userId } = await request.json();

    if (!plan || !userId) {
      return NextResponse.json(
        { error: 'Plan and userId are required' },
        { status: 400 }
      );
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS];
    if (!selectedPlan) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: selectedPlan.name,
              description: selectedPlan.features.join(', '),
            },
            unit_amount: selectedPlan.price * 100, // Convert to cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.nextUrl.origin}/dashboard?success=true&plan=${plan}`,
      cancel_url: `${request.nextUrl.origin}/settings?canceled=true`,
      metadata: {
        userId,
        plan,
      },
      customer_email: userId, // You might want to get actual email from user
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
