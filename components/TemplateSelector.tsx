'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Check, Eye, Star, Crown, Zap } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  category: string
  tier: 'free' | 'pro' | 'business'
  preview: {
    headerStyle: string
    colorScheme: string
    layout: string
    features: string[]
  }
  isPopular?: boolean
  isNew?: boolean
}

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void
  onCancel: () => void
  selectedTemplate?: string
}

const templates: Template[] = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean, professional design perfect for consultants and freelancers',
    category: 'Professional',
    tier: 'free',
    isPopular: true,
    preview: {
      headerStyle: 'Centered logo with clean typography',
      colorScheme: 'Blue and gray accents',
      layout: 'Single column with clear sections',
      features: ['Logo placement', 'Payment terms', 'Notes section', 'Tax calculations']
    }
  },
  {
    id: 'creative-bold',
    name: 'Creative Bold',
    description: 'Eye-catching design for creative agencies and designers',
    category: 'Creative',
    tier: 'pro',
    isNew: true,
    preview: {
      headerStyle: 'Large header with brand colors',
      colorScheme: 'Customizable brand colors',
      layout: 'Two-column layout with visual elements',
      features: ['Custom branding', 'Color customization', 'Visual elements', 'Modern typography']
    }
  },
  {
    id: 'corporate-professional',
    name: 'Corporate Professional',
    description: 'Formal template for established businesses and corporations',
    category: 'Corporate',
    tier: 'pro',
    preview: {
      headerStyle: 'Traditional header with company details',
      colorScheme: 'Navy blue and gray',
      layout: 'Structured layout with clear hierarchy',
      features: ['Company letterhead', 'Terms & conditions', 'Multiple tax rates', 'Legal compliance']
    }
  },
  {
    id: 'startup-modern',
    name: 'Startup Modern',
    description: 'Fresh, innovative design for tech startups and modern businesses',
    category: 'Tech',
    tier: 'business',
    preview: {
      headerStyle: 'Modern header with gradient accents',
      colorScheme: 'Purple and teal gradients',
      layout: 'Card-based layout with modern spacing',
      features: ['Gradient design', 'Interactive elements', 'QR codes', 'Multiple currencies']
    }
  },
  {
    id: 'freelancer-simple',
    name: 'Freelancer Simple',
    description: 'Perfect for individual freelancers and small service providers',
    category: 'Freelancer',
    tier: 'free',
    preview: {
      headerStyle: 'Simple header with contact info',
      colorScheme: 'Green and white',
      layout: 'Clean single-column layout',
      features: ['Contact details', 'Service descriptions', 'Hours tracking', 'Simple totals']
    }
  },
  {
    id: 'retail-store',
    name: 'Retail Store',
    description: 'Designed for retail businesses and product sales',
    category: 'Retail',
    tier: 'pro',
    preview: {
      headerStyle: 'Store branding with product focus',
      colorScheme: 'Orange and black',
      layout: 'Product-focused layout',
      features: ['Product images', 'SKU tracking', 'Inventory details', 'Discount codes']
    }
  }
]

export default function TemplateSelector({ onSelectTemplate, onCancel, selectedTemplate }: TemplateSelectorProps) {
  const [currentPreview, setCurrentPreview] = useState<string>(selectedTemplate || templates[0].id)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  
  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))]
  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory)
  
  const currentTemplate = templates.find(t => t.id === currentPreview) || templates[0]

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'pro': return <Crown className="h-4 w-4 text-yellow-500" />
      case 'business': return <Zap className="h-4 w-4 text-purple-500" />
      default: return null
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'pro': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'business': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const InvoicePreview = ({ template }: { template: Template }) => {
    const getPreviewStyles = () => {
      switch (template.id) {
        case 'modern-minimal':
          return {
            header: 'text-center border-b-2 border-blue-500 pb-4 mb-6',
            title: 'text-2xl font-bold text-gray-900',
            accent: 'text-blue-600',
            layout: 'space-y-4'
          }
        case 'creative-bold':
          return {
            header: 'text-left bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-t-lg mb-6',
            title: 'text-2xl font-bold text-white',
            accent: 'text-purple-600',
            layout: 'space-y-4'
          }
        case 'corporate-professional':
          return {
            header: 'text-left border-b border-gray-300 pb-4 mb-6',
            title: 'text-xl font-semibold text-gray-900',
            accent: 'text-navy-600',
            layout: 'space-y-3'
          }
        case 'startup-modern':
          return {
            header: 'text-center bg-gradient-to-r from-purple-400 to-teal-400 text-white p-6 rounded-lg mb-6',
            title: 'text-2xl font-bold text-white',
            accent: 'text-purple-600',
            layout: 'space-y-4'
          }
        case 'freelancer-simple':
          return {
            header: 'text-left border-l-4 border-green-500 pl-4 mb-6',
            title: 'text-xl font-semibold text-gray-900',
            accent: 'text-green-600',
            layout: 'space-y-3'
          }
        case 'retail-store':
          return {
            header: 'text-center bg-orange-500 text-white p-4 rounded-lg mb-6',
            title: 'text-2xl font-bold text-white',
            accent: 'text-orange-600',
            layout: 'space-y-4'
          }
        default:
          return {
            header: 'text-center border-b pb-4 mb-6',
            title: 'text-xl font-semibold text-gray-900',
            accent: 'text-blue-600',
            layout: 'space-y-4'
          }
      }
    }

    const styles = getPreviewStyles()

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[500px]">
        <div className={styles.header}>
          <h2 className={styles.title}>INVOICE</h2>
          <p className="text-sm opacity-75">#INV-2024-001</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">From:</h4>
            <p className="text-sm text-gray-600">Your Company</p>
            <p className="text-sm text-gray-600">you@company.com</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">To:</h4>
            <p className="text-sm text-gray-600">Client Company</p>
            <p className="text-sm text-gray-600">client@company.com</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-700 border-b pb-2 mb-2">
            <div>Description</div>
            <div className="text-center">Qty</div>
            <div className="text-center">Rate</div>
            <div className="text-right">Amount</div>
          </div>
          <div className="grid grid-cols-4 gap-2 py-2 text-xs">
            <div>Web Development</div>
            <div className="text-center">40</div>
            <div className="text-center">£75</div>
            <div className="text-right font-medium">£3,000</div>
          </div>
          <div className="grid grid-cols-4 gap-2 py-2 text-xs border-b pb-2">
            <div>Design Work</div>
            <div className="text-center">20</div>
            <div className="text-center">£50</div>
            <div className="text-right font-medium">£1,000</div>
          </div>
        </div>

        <div className="text-right space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>£4,000</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (20%):</span>
            <span>£800</span>
          </div>
          <div className={`flex justify-between font-bold text-lg ${styles.accent}`}>
            <span>Total:</span>
            <span>£4,800</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Invoice Template</h2>
            <p className="text-gray-600 mt-1">Select a professional template that matches your brand</p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 text-2xl font-light"
          >
            ×
          </button>
        </div>

        <div className="flex h-[calc(90vh-200px)]">
          {/* Template List */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            {/* Category Filter */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Cards */}
            <div className="p-4 space-y-3">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  onClick={() => setCurrentPreview(template.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                    currentPreview === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      {template.isPopular && (
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                      {template.isNew && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    {getTierIcon(template.tier)}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getTierColor(template.tier)}`}>
                      {template.tier.charAt(0).toUpperCase() + template.tier.slice(1)}
                    </span>
                    <div className="flex items-center space-x-2">
                      {currentPreview === template.id && (
                        <Check className="h-4 w-4 text-blue-600" />
                      )}
                      <Eye className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 flex flex-col">
            {/* Preview Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                    <span>{currentTemplate.name}</span>
                    {getTierIcon(currentTemplate.tier)}
                  </h3>
                  <p className="text-gray-600">{currentTemplate.description}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm border ${getTierColor(currentTemplate.tier)}`}>
                    {currentTemplate.tier.charAt(0).toUpperCase() + currentTemplate.tier.slice(1)}
                  </span>
                </div>
              </div>
              
              {/* Template Features */}
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Header Style:</span>
                  <p className="text-gray-600">{currentTemplate.preview.headerStyle}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Color Scheme:</span>
                  <p className="text-gray-600">{currentTemplate.preview.colorScheme}</p>
                </div>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <InvoicePreview template={currentTemplate} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{currentTemplate.preview.features.length} features:</span>
            <span className="ml-1">{currentTemplate.preview.features.join(', ')}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSelectTemplate(currentPreview)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Use This Template
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
