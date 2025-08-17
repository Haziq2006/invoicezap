'use client'

import { useState } from 'react'
import { ArrowRight, Zap, FileText, Send, CreditCard, BarChart3, CheckCircle, Star, Shield, Clock, Users, TrendingUp, Play, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import PaymentLogosAndFAQ from '@/components/PaymentLogos'

export default function HomePage() {
  const [email, setEmail] = useState('')

  const handleEmailCapture = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }
    
    try {
      // Send email to email capture API
      const response = await fetch('/api/email/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'leads@invoicezap.com', // TODO: Configure lead capture email
          subject: 'New Landing Page Lead',
          content: `New lead captured: ${email}`,
          html: `
            <h2>New Lead Captured</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Source:</strong> Landing Page</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          `
        })
      })
      
      if (response.ok) {
        toast.success('Thank you! We\'ll be in touch soon.')
        setEmail('')
        
        // Store in localStorage for analytics (client-side only)
        if (typeof window !== 'undefined') {
          const leads = JSON.parse(localStorage.getItem('invoicezap_leads') || '[]')
          leads.push({ email, timestamp: new Date().toISOString() })
          localStorage.setItem('invoicezap_leads', JSON.stringify(leads))
        }
      } else {
        throw new Error('Failed to capture email')
      }
    } catch (error) {
      console.error('Email capture error:', error)
      toast.error('Failed to capture email. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                InvoiceZap
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Pricing</Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Reviews</Link>
              <Link href="#faq" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">FAQ</Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Login</Link>
              <Link href="/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full px-6 py-3 mb-8 shadow-lg">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-gray-700">Trusted by 50,000+ freelancers</span>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-white"></div>
              ))}
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Create Professional Invoices in
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> 30 Seconds</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Stop waiting for payments. InvoiceZap helps freelancers create, send, and track invoices instantly. 
            <span className="font-semibold text-gray-800"> Get paid 3x faster</span> with our simple, mobile-friendly platform.
          </p>
          
          {/* CTA Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleEmailCapture} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-400"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center space-x-2 min-w-[200px]"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3 text-gray-600">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="font-medium">No credit card required</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-gray-600">
              <Clock className="h-5 w-5 text-blue-500 flex-shrink-0" />
              <span className="font-medium">Setup in 2 minutes</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-gray-600">
              <Shield className="h-5 w-5 text-purple-500 flex-shrink-0" />
              <span className="font-medium">Bank-level security</span>
            </div>
          </div>

          {/* Demo Video */}
          <div className="mt-16">
            <div className="inline-flex items-center space-x-3 text-gray-600 hover:text-gray-900 cursor-pointer group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Play className="h-8 w-8 text-white ml-1" />
              </div>
              <div className="text-left">
                <div className="font-semibold">See InvoiceZap in action</div>
                <div className="text-sm">2-minute demo video</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-lg text-gray-600 mb-4">Trusted by freelancers at</p>
            <div className="flex items-center justify-center space-x-12 opacity-60">
              <div className="text-2xl font-bold text-gray-400">FREELANCER</div>
              <div className="text-2xl font-bold text-gray-400">UPWORK</div>
              <div className="text-2xl font-bold text-gray-400">FIVERR</div>
              <div className="text-2xl font-bold text-gray-400">TOPTAL</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              <span>Why choose InvoiceZap?</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything you need to
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> get paid faster</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From invoice creation to payment tracking, we've got you covered with features designed specifically for freelancers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "Lightning Fast Creation",
                description: "Fill out a simple form and generate professional invoices in under 30 seconds",
                color: "blue",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                icon: Send,
                title: "Instant Delivery",
                description: "Send invoices via email, WhatsApp, or download PDFs for offline use",
                color: "green",
                gradient: "from-green-500 to-green-600"
              },
              {
                icon: CreditCard,
                title: "Flexible Payment Links",
                description: "Use ANY payment processor - Stripe, PayPal, Square, Wise, or your preferred method",
                color: "purple",
                gradient: "from-purple-500 to-purple-600"
              },
              {
                icon: BarChart3,
                title: "Smart Analytics",
                description: "Track payment times, revenue trends, and client payment history",
                color: "orange",
                gradient: "from-orange-500 to-orange-600"
              },
              {
                icon: Zap,
                title: "Beautiful Templates",
                description: "Choose from 5+ professional templates designed for freelancers",
                color: "indigo",
                gradient: "from-indigo-500 to-indigo-600"
              },
              {
                icon: Users,
                title: "Client Management",
                description: "Store client details, payment history, and communication logs",
                color: "pink",
                gradient: "from-pink-500 to-pink-600"
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Loved by freelancers worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our users are saying about InvoiceZap
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "UX Designer",
                company: "Freelance",
                content: "InvoiceZap saved me hours every month. The templates are gorgeous and clients love the professional look.",
                rating: 5,
                avatar: "SC"
              },
              {
                name: "Marcus Rodriguez",
                role: "Web Developer",
                company: "Self-employed",
                content: "Finally got paid on time! The payment links feature is a game-changer. My cash flow improved dramatically.",
                rating: 5,
                avatar: "MR"
              },
              {
                name: "Emma Thompson",
                role: "Content Writer",
                company: "Freelance",
                content: "The mobile app is incredible. I can create invoices while commuting. It's like having a business manager in my pocket.",
                rating: 5,
                avatar: "ET"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50K+", label: "Active Users" },
              { number: "2M+", label: "Invoices Created" },
              { number: "£15M+", label: "Revenue Generated" },
              { number: "98%", label: "Satisfaction Rate" }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4" />
              <span>Start free, scale as you grow</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No hidden fees, no surprises. Choose the plan that fits your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Forever</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">£0</div>
                <p className="text-gray-600">Perfect for getting started</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited invoices",
                  "3 professional templates",
                  "PDF export",
                  "Email delivery",
                  "Basic analytics",
                  "Mobile app access"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="w-full bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-200 block text-center">
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-blue-500 relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">£12</div>
                <p className="text-gray-600">For growing freelancers</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Everything in Free",
                  "All 5 premium templates",
                  "Custom branding",
                  "Stripe payment links",
                  "Advanced analytics",
                  "Priority support",
                  "Client portal",
                  "Recurring invoices"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=pro" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 block text-center">
                Start Pro Free
              </Link>
            </div>

            {/* Business Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Business</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">£35</div>
                <p className="text-gray-600">For established businesses</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Everything in Pro",
                  "Team collaboration",
                  "Advanced reporting",
                  "API access",
                  "White-label options",
                  "Dedicated account manager",
                  "Custom integrations",
                  "Bulk operations"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=business" className="w-full bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-200 block text-center">
                Start Business Free
              </Link>
            </div>
          </div>

          {/* Money-back guarantee */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-6 py-3 rounded-full">
              <Shield className="h-5 w-5" />
              <span className="font-medium">30-day money-back guarantee. No questions asked.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Providers & FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <CreditCard className="h-4 w-4" />
              <span>Works with any payment processor</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Maximum Payment Flexibility
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              InvoiceZap supports 25+ payment processors worldwide. Use your existing PayPal, Stripe, or any other payment method.
            </p>
          </div>

          <PaymentLogosAndFAQ />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to get paid faster?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join 50,000+ freelancers who are already using InvoiceZap to streamline their invoicing and get paid on time
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/onboarding" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 inline-flex items-center space-x-2">
              <span>Find Your Perfect Template</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <div className="text-gray-400 text-sm">
              <div>✓ No credit card required</div>
              <div>✓ Setup in 2 minutes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">InvoiceZap</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The fastest way for freelancers to create and send professional invoices. Get paid faster with our simple, mobile-friendly platform.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-6">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/templates" className="hover:text-white transition-colors">Templates</Link></li>
                <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-6">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-6">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors">Status</Link></li>
                <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; 2024 InvoiceZap. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
