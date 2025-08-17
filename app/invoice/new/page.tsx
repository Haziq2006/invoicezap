'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Download, 
  Send, 
  Eye,
  Save,
  Palette
} from 'lucide-react'
import toast from 'react-hot-toast'
import Navigation from '@/components/Navigation'
import TemplateSelector from '@/components/TemplateSelector'
import PaymentLogos from '@/components/PaymentLogos'


interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

interface InvoiceData {
  invoiceNumber: string
  issueDate: string
  dueDate: string
  clientName: string
  clientEmail: string
  clientAddress: string
  lineItems: LineItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  notes: string
  template: string
  includePaymentLink: boolean
  paymentLinkType: 'stripe' | 'custom' | 'none'
  customPaymentLink: string
  customPaymentText: string
}

export default function NewInvoicePage() {
  const router = useRouter()
  const [showTemplateSelector, setShowTemplateSelector] = useState(true)
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: generateInvoiceNumber(),
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    lineItems: [
      { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
    ],
    subtotal: 0,
    taxRate: 20,
    taxAmount: 0,
    total: 0,
    notes: '',
    template: 'modern-minimal',
    includePaymentLink: true,
    paymentLinkType: 'stripe',
    customPaymentLink: '',
    customPaymentText: 'Pay Now'
  })

  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')

  function generateInvoiceNumber(): string {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `INV-${year}${month}-${random}`
  }

  useEffect(() => {
    const subtotal = invoiceData.lineItems.reduce((sum, item) => sum + item.amount, 0)
    const taxAmount = (subtotal * invoiceData.taxRate) / 100
    const total = subtotal + taxAmount

    setInvoiceData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      total
    }))
  }, [invoiceData.lineItems, invoiceData.taxRate])



  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    }

    setInvoiceData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem]
    }))
  }

  const removeLineItem = (id: string) => {
    if (invoiceData.lineItems.length > 1) {
      setInvoiceData(prev => ({
        ...prev,
        lineItems: prev.lineItems.filter(item => item.id !== id)
      }))
    }
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setInvoiceData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = Number(updatedItem.quantity) * Number(updatedItem.rate)
          }
          return updatedItem
        }
        return item
      })
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save invoice using the API
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...invoiceData,
          userId: 'user_123' // TODO: Get from auth context
        })
      })
      
      if (response.ok) {
        toast.success('Invoice saved successfully!')
        router.push('/dashboard')
      } else {
        throw new Error('Failed to save invoice')
      }
    } catch (error) {
      toast.error('Failed to save invoice. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSend = async () => {
    try {
      // Send invoice via email API
      const response = await fetch('/api/email/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoiceData.invoiceNumber,
          clientEmail: invoiceData.clientEmail,
          clientName: invoiceData.clientName,
          amount: invoiceData.total,
          dueDate: invoiceData.dueDate
        })
      })
      
      if (response.ok) {
        toast.success('Invoice sent successfully!')
      } else {
        throw new Error('Failed to send invoice')
      }
    } catch (error) {
      toast.error('Failed to send invoice. Please try again.')
    }
  }

  const handleDownload = () => {
    try {
      // Import PDF generator dynamically to avoid SSR issues
      import('@/lib/pdfGenerator').then(({ downloadInvoicePDF }) => {
        // Get user profile data for company details
        const userProfile = JSON.parse(localStorage.getItem('invoicezap_userProfile') || '{}')
        
        const pdfData = {
          ...invoiceData,
          companyName: userProfile.company || 'Your Company Name',
          companyAddress: userProfile.address || 'Your Address',
          companyEmail: userProfile.email || 'your@email.com',
          companyPhone: userProfile.phone || '+44 20 1234 5678'
        }
        downloadInvoicePDF(pdfData)
        toast.success('PDF download started!')
      })
    } catch (error) {
      toast.error('Failed to generate PDF. Please try again.')
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    setInvoiceData(prev => ({ ...prev, template: templateId }))
    setShowTemplateSelector(false)
  }

  const handleTemplateCancel = () => {
    router.push('/dashboard')
  }

  const templates = [
    { id: 'modern-minimal', name: 'Modern Minimal', description: 'Clean and professional design' },
    { id: 'creative-bold', name: 'Creative Bold', description: 'Eye-catching design for creatives' },
    { id: 'corporate-professional', name: 'Corporate Professional', description: 'Formal business template' },
    { id: 'startup-modern', name: 'Startup Modern', description: 'Fresh design for tech companies' },
    { id: 'freelancer-simple', name: 'Freelancer Simple', description: 'Perfect for individual freelancers' },
    { id: 'retail-store', name: 'Retail Store', description: 'Designed for retail businesses' }
  ]

  // Show template selector first
  if (showTemplateSelector) {
    return (
      <>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
        </div>
        <TemplateSelector
          onSelectTemplate={handleTemplateSelect}
          onCancel={handleTemplateCancel}
          selectedTemplate={invoiceData.template}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <Navigation />
        
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Create New Invoice</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowTemplateSelector(true)}
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <Palette className="h-4 w-4" />
                <span>Change Template</span>
              </button>
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>{isPreviewMode ? 'Edit' : 'Preview'}</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Invoice Form */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selected Template
                  </label>
                  <div className="input-field bg-gray-50 flex items-center justify-between">
                    <span className="text-gray-800 font-medium">
                      {templates.find(t => t.id === invoiceData.template)?.name || 'Modern Minimal'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowTemplateSelector(true)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Change
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={invoiceData.issueDate}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, issueDate: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={invoiceData.clientName}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, clientName: e.target.value }))}
                    className="input-field"
                    placeholder="Client Company Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Email
                  </label>
                  <input
                    type="email"
                    value={invoiceData.clientEmail}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, clientEmail: e.target.value }))}
                    className="input-field"
                    placeholder="client@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Address
                  </label>
                  <textarea
                    value={invoiceData.clientAddress}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, clientAddress: e.target.value }))}
                    className="input-field"
                    rows={3}
                    placeholder="Client's billing address"
                  />
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Line Items</h3>
                <button
                  onClick={addLineItem}
                  className="btn-secondary inline-flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Item</span>
                </button>
              </div>
              <div className="space-y-4">
                {invoiceData.lineItems.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                        className="input-field"
                        placeholder="Service or product description"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Qty
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                        className="input-field"
                        min="1"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rate
                      </label>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateLineItem(item.id, 'rate', Number(e.target.value))}
                        className="input-field"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                      </label>
                      <div className="input-field bg-gray-50 text-gray-600">
                        £{item.amount.toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={() => removeLineItem(item.id)}
                        disabled={invoiceData.lineItems.length === 1}
                        className="text-red-500 hover:text-red-700 disabled:text-gray-300 p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Options */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💳 Payment Options</h3>
              <div className="space-y-6">
                {/* Payment Type Selection */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">How do you want clients to pay?</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Stripe Option */}
                    <div 
                      onClick={() => setInvoiceData(prev => ({ ...prev, paymentLinkType: 'stripe', includePaymentLink: true }))}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        invoiceData.paymentLinkType === 'stripe' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl">💎</span>
                        </div>
                        <h5 className="font-semibold text-gray-900 mb-1">Auto Stripe</h5>
                        <p className="text-xs text-gray-500">Automatic payment link</p>
                      </div>
                    </div>

                    {/* Custom Link Option */}
                    <div 
                      onClick={() => setInvoiceData(prev => ({ ...prev, paymentLinkType: 'custom', includePaymentLink: true }))}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        invoiceData.paymentLinkType === 'custom' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl">🔗</span>
                        </div>
                        <h5 className="font-semibold text-gray-900 mb-1">Custom Link</h5>
                        <p className="text-xs text-gray-500">Your own payment link</p>
                      </div>
                    </div>

                    {/* No Payment Link */}
                    <div 
                      onClick={() => setInvoiceData(prev => ({ ...prev, paymentLinkType: 'none', includePaymentLink: false }))}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        invoiceData.paymentLinkType === 'none' 
                          ? 'border-gray-500 bg-gray-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl">📄</span>
                        </div>
                        <h5 className="font-semibold text-gray-900 mb-1">Invoice Only</h5>
                        <p className="text-xs text-gray-500">No payment link</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stripe Details */}
                {invoiceData.paymentLinkType === 'stripe' && invoiceData.includePaymentLink && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <h5 className="font-medium text-blue-900 mb-1">Stripe Payment Link</h5>
                        <p className="text-sm text-blue-700 mb-2">
                          A secure payment link will be automatically generated when you send this invoice.
                        </p>
                        <div className="text-xs text-blue-600">
                          ✨ Accepts: Credit Cards, Apple Pay, Google Pay, Bank Transfers
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Custom Payment Link */}
                {invoiceData.paymentLinkType === 'custom' && invoiceData.includePaymentLink && (
                  <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs">🔗</span>
                      </div>
                      <div>
                        <h5 className="font-medium text-green-900 mb-1">Custom Payment Link</h5>
                        <p className="text-sm text-green-700">
                          Add your own payment link from any provider (PayPal, Square, Wise, bank transfer, etc.)
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Link URL
                        </label>
                  <input
                          type="url"
                          value={invoiceData.customPaymentLink}
                          onChange={(e) => setInvoiceData(prev => ({ ...prev, customPaymentLink: e.target.value }))}
                          placeholder="https://paypal.me/yourlink or https://buy.stripe.com/..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Works with: PayPal.me, Stripe Payment Links, Square, Wise, Venmo, or any payment URL
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Button Text
                    </label>
                        <input
                          type="text"
                          value={invoiceData.customPaymentText}
                          onChange={(e) => setInvoiceData(prev => ({ ...prev, customPaymentText: e.target.value }))}
                          placeholder="Pay Now"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Examples: "Pay Now", "Pay with PayPal", "Pay via Bank Transfer"
                        </p>
                        </div>

                      {invoiceData.customPaymentLink && (
                        <div className="p-3 bg-white rounded border border-green-200">
                          <div className="text-xs text-gray-600 mb-1">Preview:</div>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                            {invoiceData.customPaymentText || 'Pay Now'}
                          </button>
                      </div>
                    )}
                    </div>
                  </div>
                )}

                {/* No Payment Link */}
                {invoiceData.paymentLinkType === 'none' && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs">📄</span>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Invoice Only</h5>
                        <p className="text-sm text-gray-600">
                          No payment link will be included. Add payment instructions in the notes section below.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Logos Showcase */}
                <div className="border-t pt-6">
                  <PaymentLogos />
                  <div className="text-center mt-3">
                    <Link 
                      href="/payment-providers" 
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      View all 25+ supported payment processors
                    </Link>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Why Use Custom Payment Links?</h4>
                      <p className="text-xs text-gray-500">Maximum flexibility for your business</p>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span>✅ No vendor lock-in</span>
                      <span>✅ Works immediately</span>
                      <span>✅ Global coverage</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">Debit Card</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">Bank Transfer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax and Notes */}
            <div className="card">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={invoiceData.taxRate}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, taxRate: Number(e.target.value) }))}
                    className="input-field"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Amount
                  </label>
                  <div className="input-field bg-gray-50 text-gray-600">
                    £{invoiceData.taxAmount.toFixed(2)}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={invoiceData.notes}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
                  className="input-field"
                  rows={3}
                  placeholder="Additional notes or terms..."
                />
              </div>
            </div>

            {/* Totals */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">£{invoiceData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ({invoiceData.taxRate}%):</span>
                  <span className="font-medium">£{invoiceData.taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-primary-600">
                      £{invoiceData.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Preview */}
          <div className="lg:sticky lg:top-8">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDownload}
                    className="btn-secondary inline-flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={handleSend}
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
              
              {/* Invoice Preview Content */}
              <div className="border border-gray-200 rounded-lg p-6 bg-white">
                {/* Template-specific header styling */}
                {invoiceData.template === 'modern-minimal' && (
                  <div className="text-center border-b-2 border-blue-500 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
                    <p className="text-blue-600">#{invoiceData.invoiceNumber}</p>
                  </div>
                )}
                
                {invoiceData.template === 'creative-bold' && (
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg mb-6">
                    <h2 className="text-2xl font-bold text-white">INVOICE</h2>
                    <p className="text-purple-100">#{invoiceData.invoiceNumber}</p>
                  </div>
                )}
                
                {invoiceData.template === 'corporate-professional' && (
                  <div className="border-b border-gray-400 pb-4 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">INVOICE</h2>
                    <p className="text-gray-600">#{invoiceData.invoiceNumber}</p>
                  </div>
                )}
                
                {invoiceData.template === 'startup-modern' && (
                  <div className="bg-gradient-to-r from-purple-400 to-teal-400 text-white p-6 rounded-lg mb-6 text-center">
                    <h2 className="text-2xl font-bold text-white">INVOICE</h2>
                    <p className="text-purple-100">#{invoiceData.invoiceNumber}</p>
                  </div>
                )}
                
                {invoiceData.template === 'freelancer-simple' && (
                  <div className="border-l-4 border-green-500 pl-4 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">INVOICE</h2>
                    <p className="text-green-600">#{invoiceData.invoiceNumber}</p>
                  </div>
                )}
                
                {invoiceData.template === 'retail-store' && (
                  <div className="bg-orange-500 text-white p-4 rounded-lg mb-6 text-center">
                    <h2 className="text-2xl font-bold text-white">INVOICE</h2>
                    <p className="text-orange-100">#{invoiceData.invoiceNumber}</p>
                  </div>
                )}
                
                {/* Default fallback */}
                {!['modern-minimal', 'creative-bold', 'corporate-professional', 'startup-modern', 'freelancer-simple', 'retail-store'].includes(invoiceData.template) && (
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
                  <p className="text-gray-600">#{invoiceData.invoiceNumber}</p>
                </div>
                )}

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">From:</h4>
                    <p className="text-gray-600">Your Company Name</p>
                    <p className="text-gray-600">your@email.com</p>
                    <p className="text-gray-600">Your Address</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">To:</h4>
                    <p className="text-gray-600">{invoiceData.clientName || 'Client Name'}</p>
                    <p className="text-gray-600">{invoiceData.clientEmail || 'client@email.com'}</p>
                    <p className="text-gray-600">{invoiceData.clientAddress || 'Client Address'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <span className="text-gray-600">Issue Date:</span>
                    <p className="font-medium">{invoiceData.issueDate}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Due Date:</span>
                    <p className="font-medium">{invoiceData.dueDate}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700 mb-2">
                    <div>Description</div>
                    <div className="text-center">Qty</div>
                    <div className="text-center">Rate</div>
                    <div className="text-right">Amount</div>
                  </div>
                  {invoiceData.lineItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-4 gap-4 py-2 border-b border-gray-100">
                      <div className="text-sm">{item.description || 'Item description'}</div>
                      <div className="text-center text-sm">{item.quantity}</div>
                      <div className="text-center text-sm">£{item.rate.toFixed(2)}</div>
                      <div className="text-right text-sm font-medium">£{item.amount.toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>£{invoiceData.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax ({invoiceData.taxRate}%):</span>
                      <span>£{invoiceData.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className={`flex justify-between text-lg font-bold ${
                      invoiceData.template === 'modern-minimal' ? 'text-blue-600' :
                      invoiceData.template === 'creative-bold' ? 'text-purple-600' :
                      invoiceData.template === 'corporate-professional' ? 'text-gray-900' :
                      invoiceData.template === 'startup-modern' ? 'text-purple-600' :
                      invoiceData.template === 'freelancer-simple' ? 'text-green-600' :
                      invoiceData.template === 'retail-store' ? 'text-orange-600' :
                      'text-gray-900'
                    }`}>
                      <span>Total:</span>
                      <span>£{invoiceData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {invoiceData.notes && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Notes:</h4>
                    <p className="text-gray-600 text-sm">{invoiceData.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
