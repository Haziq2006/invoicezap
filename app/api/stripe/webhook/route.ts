import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Production logging function
const logWebhookEvent = (event: Stripe.Event, status: 'received' | 'processed' | 'error', error?: any) => {
  const logData = {
    eventId: event.id,
    eventType: event.type,
    timestamp: new Date().toISOString(),
    status,
    userId: event.data.object.metadata?.userId,
    ...(error && { error: error.message })
  };
  
  console.log(`Webhook ${status}:`, logData);
  
  // In production, you might want to send this to a logging service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to external logging service
    // await logToService(logData);
  }
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    logWebhookEvent(event, 'received');
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    logWebhookEvent({ id: 'unknown', type: 'unknown', data: { object: {} } } as Stripe.Event, 'error', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(failedInvoice);
        break;

      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(deletedSubscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    logWebhookEvent(event, 'processed');
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    logWebhookEvent(event, 'error', error);
    
    // In production, you might want to send alerts for webhook failures
    if (process.env.NODE_ENV === 'production') {
      // Example: Send alert to your team
      // await sendWebhookFailureAlert(event, error);
    }
    
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const { userId, plan } = session.metadata || {}
    
    if (userId && plan) {
      // Update user plan in database
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user/update-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          plan,
          stripeSubscriptionId: session.subscription,
          status: 'active'
        })
      })
      
      if (response.ok) {
        console.log(`User ${userId} upgraded to ${plan} plan`)
        
        // Send welcome email for new subscribers
        const emailService = new (await import('@/lib/emailService')).EmailService()
        await emailService.sendEmail({
          to: session.customer_details?.email || '',
          subject: `Welcome to InvoiceZap ${plan.charAt(0).toUpperCase() + plan.slice(1)}!`,
          content: `Congratulations! You've successfully upgraded to our ${plan} plan. You now have access to all premium features.`,
          html: `
            <h2>Welcome to InvoiceZap ${plan.charAt(0).toUpperCase() + plan.slice(1)}!</h2>
            <p>Congratulations! You've successfully upgraded to our ${plan} plan.</p>
            <p>You now have access to:</p>
            <ul>
              ${plan === 'pro' ? `
                <li>✓ All premium templates</li>
                <li>✓ Custom branding</li>
                <li>✓ Stripe payment links</li>
                <li>✓ Advanced analytics</li>
                <li>✓ Priority support</li>
              ` : plan === 'business' ? `
                <li>✓ Everything in Pro</li>
                <li>✓ Team collaboration</li>
                <li>✓ Advanced reporting</li>
                <li>✓ API access</li>
                <li>✓ Dedicated account manager</li>
              ` : ''}
            </ul>
            <p>Start creating professional invoices right away!</p>
          `
        })
      } else {
        console.error('Failed to update user plan in database')
      }
    }
  } catch (error) {
    console.error('Error handling checkout completed:', error)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    // Handle successful payment
    // TODO: Update invoice status in database
    console.log(`Payment succeeded for invoice ${invoice.id}`)
  } catch (error) {
    console.error('Error handling payment succeeded:', error)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    // Handle failed payment
    // TODO: Update invoice status and send notification
    console.log(`Payment failed for invoice ${invoice.id}`)
  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    // Handle subscription updates
    // TODO: Update user subscription status in database
    console.log(`Subscription ${subscription.id} updated`)
  } catch (error) {
    console.error('Error handling subscription updated:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    // Handle subscription deletion
    // TODO: Update user plan to free in database
    console.log(`Subscription ${subscription.id} deleted`)
  } catch (error) {
    console.error('Error handling subscription deleted:', error)
  }
}
