'use client'

import Navigation from '@/components/Navigation'
import PaymentLogosAndFAQ from '@/components/PaymentLogos'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'

export default function PaymentProvidersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/invoice/new" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Create Invoice
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🌍 Supported Payment Processors
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              InvoiceZap works with any payment processor that provides a payment link
            </p>
            
            {/* Benefits */}
            <div className="flex justify-center space-x-8 mb-8">
              <div className="flex items-center text-green-600">
                <Check className="h-5 w-5 mr-2" />
                <span>No vendor lock-in</span>
              </div>
              <div className="flex items-center text-green-600">
                <Check className="h-5 w-5 mr-2" />
                <span>Works immediately</span>
              </div>
              <div className="flex items-center text-green-600">
                <Check className="h-5 w-5 mr-2" />
                <span>Global coverage</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Logos and FAQ */}
        <PaymentLogosAndFAQ />

        {/* How It Works */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🚀 How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Choose Your Method</h4>
              <p className="text-gray-600">Select Auto Stripe, Custom Link, or Invoice Only when creating an invoice</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Paste Your Link</h4>
              <p className="text-gray-600">Add your PayPal.me, Stripe payment link, or any other payment URL</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Send & Get Paid</h4>
              <p className="text-gray-600">Your payment link is automatically included in the PDF and email</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            href="/invoice/new"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Start Creating Invoices
          </Link>
        </div>
      </div>
    </div>
  )
}
