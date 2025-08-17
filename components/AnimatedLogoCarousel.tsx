'use client'

import { useState, useEffect } from 'react'

interface PaymentProvider {
  name: string
  file: string
  color: string
}

interface AnimatedLogoCarouselProps {
  compact?: boolean
}

export default function AnimatedLogoCarousel({ compact = false }: AnimatedLogoCarouselProps) {
  const [providers, setProviders] = useState<PaymentProvider[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const response = await fetch('/logos/payment-providers.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        const providerArray = Object.values(data) as PaymentProvider[]
        setProviders(providerArray)
      } catch (error) {
        console.error('Failed to load payment providers:', error)
        setProviders([])
      } finally {
        setLoading(false)
      }
    }

    loadProviders()
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <div className="animate-pulse">Loading payment providers...</div>
      </div>
    )
  }

  if (providers.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <div className="text-gray-600">No payment providers found.</div>
      </div>
    )
  }

  // Duplicate the array to create seamless loop
  const duplicatedProviders = [...providers, ...providers]

  if (compact) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 text-center">
          Supported Payment Providers
        </h4>
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll">
            {duplicatedProviders.map((provider, index) => (
              <div key={index} className="flex-shrink-0 mx-3 text-center group">
                <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-all">
                  <img
                    src={`/logos/${provider.file}`}
                    alt={provider.name}
                    className={`w-6 h-6 mx-auto ${provider.color}`}
                  />
                </div>
                <div className="text-xs text-gray-600 mt-1 truncate w-16">{provider.name}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-3">
          <span className="text-xs text-gray-500">+{providers.length} payment processors supported</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          💳 Supported Payment Processors
        </h3>
        <p className="text-gray-600">
          Use any payment processor you prefer - complete flexibility for your business
        </p>
      </div>

      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-6">
        <div className="flex animate-scroll">
          {duplicatedProviders.map((provider, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-4 bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group min-w-[120px]"
            >
              <img
                src={`/logos/${provider.file}`}
                alt={provider.name}
                className={`w-8 h-8 mx-auto mb-2 ${provider.color} group-hover:scale-110 transition-transform`}
              />
              <div className="text-sm font-medium text-gray-900">{provider.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{providers.length}+</div>
          <div className="text-sm text-gray-600">Providers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">195+</div>
          <div className="text-sm text-gray-600">Countries</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">50+</div>
          <div className="text-sm text-gray-600">Currencies</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">100%</div>
          <div className="text-sm text-gray-600">Flexible</div>
        </div>
      </div>
    </div>
  )
}
