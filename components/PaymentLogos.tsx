'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import AnimatedLogoCarousel from './AnimatedLogoCarousel'

const faqs = [
  {
    question: "What payment processors does InvoiceZap support?",
    answer: "InvoiceZap supports ANY payment processor that provides a payment link or URL. This includes all major providers like Stripe, PayPal, Square, Wise, and many more. You simply paste your payment link, and we'll include it in your invoice."
  },
  {
    question: "Do I need a Stripe account to use InvoiceZap?",
    answer: "No! While we offer automatic Stripe integration, you can use any payment processor you prefer. Simply choose 'Custom Payment Link' and paste your PayPal.me, Square, or any other payment URL."
  },
  {
    question: "How do custom payment links work?",
    answer: "When you choose a custom payment link, you paste your payment URL (like paypal.me/yourname) and customize the button text. This link is then included in your PDF invoice and email, making it easy for clients to pay through your preferred method."
  },
  {
    question: "Can I use different payment methods for different clients?",
    answer: "Absolutely! You can choose different payment options for each invoice. Use Stripe for some clients, PayPal for others, or even send invoice-only for clients who prefer traditional payment methods."
  },
  {
    question: "What if my payment processor isn't listed above?",
    answer: "If your payment processor provides a payment link or URL, it will work with InvoiceZap! Our system is designed to work with any payment service that generates shareable payment links."
  },
  {
    question: "Are there any fees for using custom payment links?",
    answer: "InvoiceZap doesn't charge any fees for using custom payment links. You'll only pay the fees charged by your chosen payment processor (PayPal, Stripe, etc.)."
  },
  {
    question: "Can I use cryptocurrency payment processors?",
    answer: "Yes! Any crypto payment processor that provides payment links will work, including Coinbase Commerce, BitPay, and others."
  },
  {
    question: "How secure are the payment links?",
    answer: "Payment links are as secure as the processor that generates them. All major payment processors use bank-level security and encryption to protect transactions."
  }
]

export default function PaymentLogosAndFAQ() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  return (
    <div className="space-y-8">
      {/* Animated Logo Carousel */}
      <AnimatedLogoCarousel />

      {/* FAQ Section */}
      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ❓ Frequently Asked Questions
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about payment flexibility with InvoiceZap
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors bg-white"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {expandedFAQ === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {expandedFAQ === index && (
                <div className="px-6 pb-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed pt-4">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-6 py-3 rounded-full">
            <span className="font-medium">💡 Pro Tip:</span>
            <span>Use the payment processor your clients prefer for faster payments!</span>
          </div>
        </div>
      </div>
    </div>
  )
}
