# 📧 Email Setup Guide

Your InvoiceZap app now supports **multiple email providers** with automatic detection! No domain required to get started.

## 🚀 Quick Start (Recommended): Resend

**Why Resend?**
- ✅ **FREE** 3,000 emails/month (vs SendGrid's 100/day)
- ✅ **No domain verification** required initially
- ✅ **Easier setup** - just API key
- ✅ **Better developer experience**

### Setup Steps:

1. **Sign up at [resend.com](https://resend.com)**
   - Use GitHub or email
   - Completely free, no credit card required

2. **Get your API key**
   - Go to API Keys section
   - Create new API key
   - Copy the key (starts with `re_`)

3. **Add to your environment**
   ```bash
   # In your .env.local file
   RESEND_API_KEY=re_your_actual_api_key_here
   EMAIL_FROM=noreply@yourdomain.com
   ```

4. **That's it!** 🎉
   - Your app will automatically detect and use Resend
   - No domain setup needed initially
   - Can use any "from" email address

---

## 🔧 Alternative: SendGrid

**Setup Steps:**

1. **Sign up at [sendgrid.com](https://sendgrid.com)**
2. **Create API key**
3. **Verify sender email/domain** (required)
4. **Add to environment:**
   ```bash
   SENDGRID_API_KEY=SG.your_sendgrid_api_key
   EMAIL_FROM=your_verified_email@domain.com
   ```

---

## 💻 Development Mode: Console Logging

**For testing without real emails:**

1. **Don't set any email API keys**
2. **Emails will be logged to console**
3. **Perfect for development**

```bash
# Leave these empty or unset
# RESEND_API_KEY=
# SENDGRID_API_KEY=
```

---

## 📋 How It Works

Your app **automatically detects** which email provider to use:

```javascript
// Priority order:
1. RESEND_API_KEY found → Use Resend
2. SENDGRID_API_KEY found → Use SendGrid  
3. Neither found → Console logging
```

## 🧪 Test Your Setup

Run your app and try sending an invoice:

```bash
npm run dev
```

**Console logging mode:** You'll see email content in your terminal
**Resend/SendGrid:** Real emails will be sent

---

## 🔥 Pro Tips

### For Resend:
- Start with any email address (like `noreply@yourdomain.com`)
- Upgrade later to add your own domain for better deliverability
- Free tier is generous: 3,000 emails/month

### For SendGrid:
- Requires domain verification for production
- More complex setup but established service
- Free tier: 100 emails/day

### For Development:
- Use console logging mode
- No setup required
- Perfect for testing email templates

---

## 🚨 Troubleshooting

**Emails not sending?**
1. Check your API key is correct
2. Verify environment variables are loaded
3. Check console for error messages

**Using Resend but emails bouncing?**
- Verify the recipient email exists
- Check spam folder
- Consider adding your own domain

**SendGrid issues?**
- Ensure sender email is verified
- Check SendGrid dashboard for delivery status

---

## 🎯 Next Steps

1. **Start with Resend** (easiest)
2. **Test with console logging** first
3. **Add your domain** later for better deliverability
4. **Scale up** as your business grows

Your email service is now **production-ready** and **domain-free**! 🚀
