# 🚀 Production Webhook Setup Guide

## Overview
This guide will help you set up production-ready Stripe webhooks for InvoiceZap with proper security, monitoring, and error handling.

## 🔧 Step 1: Deploy Your App

### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Your webhook URL will be:
# https://your-app-name.vercel.app/api/stripe/webhook
```

### Option B: Netlify
```bash
# Build your app
npm run build

# Deploy to Netlify
# Your webhook URL will be:
# https://your-app-name.netlify.app/api/stripe/webhook
```

### Option C: Railway
```bash
# Deploy to Railway
railway up

# Your webhook URL will be:
# https://your-app-name.railway.app/api/stripe/webhook
```

## 🔐 Step 2: Configure Stripe Webhooks

### 1. Go to Stripe Dashboard
- Visit [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
- Click **"Add endpoint"**

### 2. Set Webhook URL
```
Production URL: https://your-domain.com/api/stripe/webhook
```

### 3. Select Events to Listen For
Enable these events for InvoiceZap:

#### **Payment Events**
- `checkout.session.completed` - When subscription is created
- `invoice.payment_succeeded` - When payment is successful
- `invoice.payment_failed` - When payment fails

#### **Subscription Events**
- `customer.subscription.updated` - When subscription changes
- `customer.subscription.deleted` - When subscription is cancelled
- `customer.subscription.trial_will_end` - 3 days before trial ends

#### **Customer Events**
- `customer.created` - When new customer is created
- `customer.updated` - When customer info changes

### 4. Get Webhook Secret
- After creating the endpoint, click on it
- Copy the **Signing secret** (starts with `whsec_`)
- This is your `STRIPE_WEBHOOK_SECRET`

## 🔑 Step 3: Environment Variables

### Production Environment Variables
```env
# Stripe Keys
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key_here
STRIPE_SECRET_KEY=sk_live_your_live_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# Database (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Service
EMAIL_SERVICE_API_KEY=your_email_service_key
```

## 🛡️ Step 4: Security Best Practices

### 1. Webhook Signature Verification
Your webhook already includes signature verification:
```typescript
// This is already implemented in your webhook
event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
```

### 2. Rate Limiting
Add rate limiting to your webhook endpoint:
```typescript
// Add to your webhook route
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
```

### 3. HTTPS Only
Ensure your production domain uses HTTPS (Vercel/Netlify do this automatically).

## 📊 Step 5: Monitoring & Logging

### 1. Webhook Monitoring
- **Stripe Dashboard**: Monitor webhook delivery in Stripe Dashboard
- **Logs**: Check your hosting platform logs (Vercel, Netlify, etc.)
- **Error Tracking**: Set up Sentry or similar for error tracking

### 2. Add Logging to Webhook
```typescript
// Enhanced logging in your webhook
console.log(`Webhook received: ${event.type}`, {
  eventId: event.id,
  timestamp: new Date().toISOString(),
  userId: event.data.object.metadata?.userId
})
```

## 🧪 Step 6: Testing

### 1. Test Webhook Locally
```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook

# This will give you a test webhook secret
# Use this for local development
```

### 2. Test Production Webhook
- Go to Stripe Dashboard → Webhooks
- Click on your webhook endpoint
- Click **"Send test webhook"**
- Select an event type and send

### 3. Verify Webhook Processing
Check your logs to ensure:
- ✅ Webhook signature verification passes
- ✅ Event is processed correctly
- ✅ Database is updated
- ✅ Email notifications are sent

## 🚨 Step 7: Error Handling

### 1. Webhook Retry Logic
Stripe automatically retries failed webhooks:
- **3 retries** with exponential backoff
- **Retry intervals**: 5 minutes, 10 minutes, 1 hour
- **Maximum retry time**: 24 hours

### 2. Handle Webhook Failures
```typescript
// Add to your webhook error handling
if (error) {
  console.error('Webhook processing failed:', error)
  
  // Log to external service
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(error)
  }
  
  // Send alert to your team
  await sendAlert({
    type: 'webhook_failure',
    event: event.type,
    error: error.message
  })
}
```

## 📈 Step 8: Production Checklist

### Before Going Live
- [ ] Deploy to production with HTTPS
- [ ] Set up production Stripe keys
- [ ] Configure webhook endpoint in Stripe
- [ ] Test webhook delivery
- [ ] Set up monitoring and logging
- [ ] Configure error tracking (Sentry)
- [ ] Set up team notifications
- [ ] Test payment flow end-to-end

### After Going Live
- [ ] Monitor webhook delivery rates
- [ ] Check error logs daily
- [ ] Set up alerts for webhook failures
- [ ] Monitor payment success rates
- [ ] Track user feedback and issues

## 🔄 Step 9: Webhook Event Handlers

Your webhook already handles these events:

### `checkout.session.completed`
- Updates user plan in database
- Sends welcome email
- Activates premium features

### `invoice.payment_succeeded`
- Updates invoice status
- Sends payment confirmation
- Updates user metrics

### `invoice.payment_failed`
- Updates invoice status
- Sends payment failure notification
- Triggers retry logic

### `customer.subscription.updated`
- Updates subscription status
- Handles plan changes
- Updates billing information

### `customer.subscription.deleted`
- Downgrades user to free plan
- Sends cancellation email
- Updates user permissions

## 🆘 Troubleshooting

### Common Issues

#### 1. Webhook Not Receiving Events
- Check webhook URL is correct
- Verify HTTPS is enabled
- Check firewall/security settings
- Ensure endpoint is publicly accessible

#### 2. Signature Verification Fails
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Check webhook secret hasn't been rotated
- Ensure raw body is being passed to verification

#### 3. Events Not Processing
- Check application logs
- Verify database connections
- Ensure all required environment variables are set
- Check for JavaScript errors in webhook handler

#### 4. High Failure Rate
- Monitor webhook response times
- Check database performance
- Verify external service dependencies
- Consider implementing webhook queuing

## 📞 Support

If you encounter issues:
1. Check Stripe webhook logs in dashboard
2. Review your application logs
3. Test webhook locally with Stripe CLI
4. Contact Stripe support if needed

## 🔗 Useful Links

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)
- [Testing Webhooks](https://stripe.com/docs/webhooks/test)
